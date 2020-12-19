import { Injectable } from "@nestjs/common";
import { CronService } from "./services/cron.service";
import { CreateServiceDto, UpdateServiceDto } from "./interfaces/service.interface";
import { Service } from "./entities/service.entity";
import { CreateWebHookDto, UpdateWebHookDto } from "./interfaces/webhook.interface";
import { ServiceModel } from "./models/service.model";
import { WebHookService } from "./services/webhook.service";

@Injectable()
export class AppRespository {
   

    constructor(
        private readonly serviceModal: ServiceModel,
        private readonly cronService: CronService,
        private readonly webHookService: WebHookService,

    ) {
    }

    createService(service: CreateServiceDto) {

        const new_service = new Service();
        new_service.serviceName = service.serviceName;
        new_service.interval = service.interval;
        new_service.url = service.url;

        return this.serviceModal.createService(new_service).then((_service) => {
            return this.cronService.createCron(_service)
        })
    }

    updateService(body: UpdateServiceDto) {
        const bodyCopy = { ...body };
        delete bodyCopy.serviceId;
        return this.serviceModal.updateService(body.serviceId, bodyCopy).then((_val) => {
            if (_val?.affected > 0) {
                return this.serviceModal.fetchServiceById(body.serviceId).then((_service) => {
                    return this.cronService.updateCron(_service);
                })
            }
        })
    }

    servicesCount() {
        return this.serviceModal.getTotalServicesCount();
    }


    listServices() {
        return this.cronService.listCronInfo();
    }


    createWebHook(body: CreateWebHookDto) {
       return this.webHookService.createWebHook(body);
    }

    updateWebHook(body: UpdateWebHookDto) {
      return this.webHookService.updateWebHook(body);
    }

    listWebHook() {
        return this.webHookService.listWebHooks();
    }



}