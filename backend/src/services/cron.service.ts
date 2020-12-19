import { HttpService, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob, CronTime } from 'cron';
import { Service } from "../entities/service.entity";
import { take } from 'rxjs/operators';
import { IEventType, IPongDto, IPongResponseItem, IServiceMessage } from "../interfaces/serviceResponse.interface";
import { DowntimeModel } from "../models/downtime.model";
import { ServiceModel } from "../models/service.model";
import { WebHookService } from "./webhook.service";
import { GatewayHelperService } from "./gatewayhelper.service";

@Injectable()
export class CronService implements OnApplicationBootstrap, OnApplicationShutdown {

    constructor(
        private readonly scheduler: SchedulerRegistry,
        private readonly services: ServiceModel,
        private readonly http: HttpService,
        private readonly downTime: DowntimeModel,
        private readonly webHook: WebHookService,
        private readonly gatewayHelper: GatewayHelperService
    ) { }

    private readonly serviceSubServiceMap = new Map<string, string[]>();
    private readonly serviceStatusMap = new Map<string, string>();

    onApplicationShutdown(signal?: string) {
        this.scheduler.getCronJobs().forEach((cron) => {
            cron.stop();
        });
        for (const iterator of this.serviceStatusMap.entries()) {
            const [key, value] = iterator;
            this.services.updateService(key, { status: value });
        }
    }

    onApplicationBootstrap() {
        this.init();
    }

    init() {
        this.services.getTotalServicesCount().then((totalCount) => {
            let currentPage = 1, limit = 10, maxPages = Math.ceil(totalCount / limit);

            while (currentPage <= maxPages) {
                this.services.fetchServicesList(currentPage, limit).then((_services) => {
                    _services.forEach((service) => {
                        if (service.active) {
                            this.createCron(service);
                            this.executeCron(service.serviceId);
                        }
                    })
                })
                currentPage++;
            }
        })
    }


    createCron(service: Service) {
        const minutes = Math.floor(service.interval / 60), seconds = service.interval % 60;
        Logger.log(`Cron ${service.serviceId} scheduled at ${seconds === 0 ? '*' : '*/' + seconds} ${minutes === 0 ? '*' : '*/' + minutes} * * * *`)
        const job = new CronJob(`${seconds === 0 ? '*' : '*/' + seconds} ${minutes === 0 ? '*' : '*/' + minutes} * * * *`, () => { this.executeCron(service.serviceId) });
        this.scheduler.addCronJob(service.serviceId, job);
        job.start();

    }

    updateCron(service: Service) {

        const cron = this.scheduler.getCronJob(service.serviceId);

        if (!cron) return;

        cron.stop();
        const minutes = Math.floor(service.interval / 60), seconds = service.interval % 60;
        const newTime = new CronTime(`${seconds === 0 ? '*' : '*/' + seconds} ${minutes === 0 ? '*' : '*/' + minutes} * * * *`)
        cron.setTime(newTime);
        cron.start();

    }

    executeCron(serviceId: string) {
        return this.services.fetchServiceById(serviceId).then(async (service) => {
            Logger.log(`Cron ${serviceId} successfully ran!`);
            const startTime = Date.now();
            const start = new Date();
            await this.services.updateService(serviceId, { lastChecked: new Date() });
            this.http.get<IPongDto>(service.url).pipe(take(1)).subscribe(async (result) => {
                const tat = Date.now() - startTime;

                const { data } = result;

                const pong_dto = new IPongDto();

                for (const iterator in data) {
                    const o = Object.assign(IPongResponseItem, data[iterator]);
                    if (o.status) {
                        pong_dto[iterator] = o;
                    }
                }


                const event = new IServiceMessage<IPongDto>();
                event.pingTAT = tat;
                event.serviceName = service.serviceName;
                event.status = IEventType.CODE_HOLT;
                event.updatedAt = start.toLocaleString();



                const totalItems = Object.keys(pong_dto).length;

                const itemsDown = Object.entries(pong_dto).filter((item) => item[1].status === 'DOWN');
                const itemsUp = Object.entries(pong_dto).filter((item) => item[1].status === 'UP');
                console.log('itemdown', itemsDown);
                console.log('itemsup', itemsUp);



                if (itemsDown.length > 0 && itemsDown.length === totalItems) {
                    event.status = IEventType.CODE_GINA;
                } else if (itemsDown.length > 0 && itemsDown.length > Math.ceil(totalItems / 2)) {
                    event.status = IEventType.CODE_JAKE;
                } else if (itemsDown.length > 0 && itemsDown.length <= Math.ceil(totalItems / 2)) {
                    event.status = IEventType.CODE_ROSA;
                }



                const recentlyDown = [], recentlyUp = [];
                let recentCritical = null, recentRecovery = null;

                if (event.status == IEventType.CODE_GINA) {
                    console.log('CODE_GINA');
                    recentCritical = await this.downTime.recordDowntime(serviceId, '*');
                } else {
                    for (const item of itemsDown) {
                        const [name] = item;

                        const entry = await this.downTime.recordDowntime(serviceId, name);

                        if (entry) recentlyDown.push(name);
                    }

                    for (const item of itemsUp) {
                        const [name] = item;

                        const entry = await this.downTime.recordUptime(serviceId, name);

                        if (entry) recentlyUp.push(name);
                    }

                    recentRecovery = await this.downTime.recordUptime(serviceId, '*');
                }

                event.subServices = new IPongDto();
                const subServices = [];
                for (const iterator in pong_dto) {

                    subServices.push(iterator);

                    const item = pong_dto[iterator];
                    const info = await this.downTime.getStatsForSubService(serviceId, iterator);
                    event.subServices[iterator] = { ...item, lastDownAt: info.lastDownAt?.toLocaleString(), lastUpAt: info.lastUpAt?.toLocaleString() };

                }

                const info = await this.downTime.getStatsForSubService(serviceId, '*');
                event.lastDownAt = info?.lastDownAt?.toLocaleString();
                event.lastUpAt = info?.lastUpAt?.toLocaleString();

                const nextExecutionAt = this.scheduler.getCronJob(serviceId)?.nextDate()?.toLocaleString();

                this.serviceSubServiceMap.set(serviceId, subServices);
                this.serviceStatusMap.set(serviceId, event.status);

                this.gatewayHelper.publish('service_update', { ...event, serviceId, nextExecutionAt })
                if (recentCritical || recentRecovery?.affected > 0 || recentlyDown.length > 0 || recentlyUp.length > 0)
                    this.webHook.notify(event);


            }, async () => {
                const tat = Date.now() - startTime;

                const event = new IServiceMessage<IPongDto>();
                event.pingTAT = tat;
                event.serviceName = service.serviceName;
                event.status = IEventType.CODE_JUDY;
                this.serviceStatusMap.set(serviceId, event.status);
                const nextExecutionAt = this.scheduler.getCronJob(serviceId)?.nextDate()?.toLocaleString();
                this.gatewayHelper.publish('service_update', { ...event, serviceId, nextExecutionAt });
                const recentCritical = await this.downTime.recordDowntime(serviceId, '*');
                if (recentCritical)
                    this.webHook.notify(event);
            })
        })
    }

    listCronInfo() {
        this.services.getTotalServicesCount().then((totalCount) => {
            let currentPage = 1, limit = 10, maxPages = Math.ceil(totalCount / limit);

            while (currentPage <= maxPages) {
                this.services.fetchServicesList(currentPage, limit).then(async (_services) => {
                    const list = [];
                    for (const iterator of _services) {
                        const info = await this.downTime.getStatsForSubService(iterator.serviceId, '*');
                        let lastDownAt = info?.lastDownAt?.toLocaleString();
                        let lastUpAt = info?.lastUpAt?.toLocaleString();

                        const resp = await this.getCronInfo(iterator.serviceId);
                        const obj = { ...iterator, ...resp, lastDownAt, lastUpAt };
                        obj.status = resp.stautus ? resp.stautus : iterator.status;
                        list.push();
                    }
                    console.log('publishing');

                    this.gatewayHelper.publish('services_list', list);
                })
                currentPage++;
            }
        })
    }

    async getCronInfo(serviceId: string) {
        const subServices = this.serviceSubServiceMap.get(serviceId);
        const nextExecutionAt = this.scheduler.getCronJob(serviceId)?.nextDate()?.toLocaleString();
        const subServicesInfo = {};
        if (subServices)
            for (const iterator of subServices) {
                const item = await this.downTime.getStatsForSubService(serviceId, iterator);
                subServicesInfo[iterator] = { status: (item.lastUpAt?.getTime() ?? -1) > (item.lastDownAt?.getTime() ?? 0) ? 'UP' : 'DOWN', lastUpAt: item.lastUpAt?.toLocaleString(), lastDownAt: item.lastDownAt?.toLocaleString() };
            }
        return {
            nextExecutionAt,
            subServices: subServicesInfo,
            stautus: this.serviceStatusMap.has(serviceId) ? this.serviceStatusMap.get(serviceId) : null
        }
    }

}