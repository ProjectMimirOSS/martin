import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Service } from "../entities/service.entity";

@Injectable()
export class ServiceModel {
    constructor(@InjectRepository(Service) private readonly serviceRepo: Repository<Service>) { }

    fetchServicesList(page = 1, limit = 10) {
        return this.serviceRepo.find({ skip: (page - 1) * limit, take: limit, order: { serviceName: 'ASC', active: 'ASC', createdAt: 'ASC' } });
    }

    getTotalServicesCount() {
        return this.serviceRepo.count();
    }

    fetchServiceById(serviceId: string) {
        return this.serviceRepo.findOne(serviceId)
    }

    createService(service: Service) {
        return this.serviceRepo.save(service);
    }

    updateService(serviceId: string, service: Partial<Omit<Service, 'serviceId'>>) {
        return this.serviceRepo.update({ serviceId }, service);
    }

}