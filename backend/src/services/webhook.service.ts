import { HttpService, Injectable } from "@nestjs/common";
import { WebHook } from "../entities/webhook.entity";
import { IPongDto, IServiceMessage } from "../interfaces/serviceResponse.interface";
import { CreateWebHookDto, UpdateWebHookDto } from "../interfaces/webhook.interface";
import { WebHookModel } from "../models/webhook.model";

@Injectable()
export class WebHookService {


    constructor(
        private readonly http: HttpService,
        private readonly webHook: WebHookModel
    ) { }


    createWebHook(body: CreateWebHookDto) {
        const new_webhook = new WebHook();
        new_webhook.url = body.url;
        return this.webHook.createWebHook(new_webhook);
    }

    updateWebHook(body: UpdateWebHookDto) {
        const bodyCopy = { ...body };
        delete bodyCopy.id;
        return this.webHook.updateWebHook(body.id, bodyCopy);
    }

    listWebHooks() {
        return this.webHook.getTotalWebHooksCount().then((totalCount) => {
            console.log('total count', totalCount);

            return this.webHook.fetchWebHooksList(1, totalCount);

        })
    }


    notify(event: IServiceMessage<IPongDto>) {
        return this.webHook.getTotalWebHooksCount().then((totalCount) => {
            console.log('total count', totalCount);

            let currentPage = 1, limit = 10, maxPages = Math.ceil(totalCount / limit);
            console.log(currentPage, maxPages);

            while (currentPage <= maxPages) {
                this.webHook.fetchWebHooksList(currentPage, limit).then((_webhooks) => {
                    _webhooks.forEach((webhook) => {
                        if (webhook.active)
                            try {
                                this.http.post(webhook.url, event).toPromise()
                            } catch (error) {
                                console.error(error);
                            }
                    })
                })
                currentPage++;
            }
        })
    }


}