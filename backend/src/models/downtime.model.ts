import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { ServiceDowntime } from "../entities/serviceDowntime.entity";

@Injectable()
export class DowntimeModel {

    constructor(@InjectRepository(ServiceDowntime) private readonly downTimeRepo: Repository<ServiceDowntime>) { }


    async recordDowntime(serviceId: string, subService: string) {
        Logger.log(`Recording downtime for ${serviceId} ${subService}`);
        const val = await this.getStatsForSubService(serviceId, subService)
        const { lastDownAt, lastUpAt } = val;
        // console.log('lastDown', lastDownAt, lastUpAt?.getTime());
        // console.log('lastUp', lastUpAt, lastUpAt?.getTime());
        // console.log('\n\n\n');


        if (lastDownAt) {
            if (lastUpAt) {
                if (lastDownAt.getTime() < lastUpAt.getTime()) {
                    return this.downTimeRepo.create({ serviceId, subService, downAt: new Date() }).save();
                }
            }
            return null;
        } else {
            if (lastUpAt) {
                return await (await this.downTimeRepo.update({ serviceId, subService, upAt: lastUpAt }, { downAt: new Date() })).affected;
            }
            return this.downTimeRepo.create({ serviceId, subService, downAt: new Date() }).save();
        }

    }

    async recordUptime(serviceId: string, subService: string) {
        const val = await this.getStatsForSubService(serviceId, subService)
        const { lastDownAt, lastUpAt } = val;

        Logger.log(`Recording uptime for ${serviceId} ${subService}`);
        // console.log('lastDown', lastDownAt, lastUpAt?.getTime());
        // console.log('lastUp', lastUpAt, lastUpAt?.getTime());
        // console.log('\n\n\n');


        if (lastUpAt) {

            if (lastDownAt && lastUpAt.getTime() < lastDownAt?.getTime()) {
                if (lastDownAt.getTime() < Date.now()) {
                    const entry = new ServiceDowntime();
                    entry.serviceId = serviceId;
                    entry.subService = subService;
                    entry.upAt = new Date();
                    return entry.save();
                }
            }
            return null;
        } else {
            const entry = new ServiceDowntime();
            entry.serviceId = serviceId;
            entry.subService = subService;
            entry.upAt = new Date();
            return entry.save();
        }
    }

    async getStatsForSubService(serviceId: string, subService: string) {
        const lastDown = await this.getDownTimeForSubService(serviceId, subService);
        const lastUp = await this.getUpTimeForSubService(serviceId, subService);

        // console.log('***********status***********', new Date());
        // console.log(`service:${serviceId}\tsubservice:${subService}`);
        // console.log(`lastup`);
        // console.log(lastUp, '\n');
        // console.log(`lastDown`); console.log(lastDown, '\n');

        // console.log('***********status***********\n\n\n');

        return {
            lastDownAt: lastDown,
            lastUpAt: lastUp
        }
    }

    async getDownTimeForSubService(serviceId: string, subService: string) {
        const subServiceDown = await this.downTimeRepo.findOne({ where: { serviceId, subService, downAt: Not(IsNull()) }, order: { downAt: 'DESC' } });
        const systemDown = await this.downTimeRepo.findOne({ where: { serviceId, subService: '*', downAt: Not(IsNull()) }, order: { downAt: 'DESC' } });

        // console.log('service', serviceId, 'subservice', subService);
        // console.log('subserviceDown', subServiceDown);
        // console.log('systemDown', systemDown);
        // console.log('\n\n\n');

        if (subServiceDown?.downAt) {
            if (systemDown?.downAt) {
                return systemDown.downAt.getTime() > subServiceDown.downAt.getTime() ? systemDown.downAt : systemDown.downAt;
            }
            return subServiceDown.downAt;
        }

        if (systemDown?.downAt) {
            return systemDown.downAt;
        }

        return null;

    }

    async getUpTimeForSubService(serviceId: string, subService: string) {
        const subSystemUp = await this.downTimeRepo.findOne({ where: { serviceId, subService, upAt: Not(IsNull()) }, order: { upAt: 'DESC' } });

        // console.log('service', serviceId, 'subservice', subService);
        // console.log('subserviceUp', subSystemUp);
        // console.log('\n\n\n');

        return subSystemUp?.upAt;
    }

}