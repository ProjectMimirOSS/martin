import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WebHook } from "../entities/webhook.entity";

@Injectable()
export class WebHookModel {

    constructor(@InjectRepository(WebHook) private readonly webHookRepo: Repository<WebHook>) { }

    createWebHook(new_webhook: WebHook) {
        return this.webHookRepo.save(new_webhook);
    }

    fetchWebHooksList(page = 1, limit = 10) {
        return this.webHookRepo.find({ skip: (page - 1) * limit, take: limit, order: { createdAt: 'ASC', active: 'ASC' } });
    }

    getTotalWebHooksCount() {
        return this.webHookRepo.count();
    }

    updateWebHook(webhookId: string, webHook: Partial<Omit<WebHook, 'id'>>) {
        return this.webHookRepo.update({ id: webhookId }, webHook);
    }

}