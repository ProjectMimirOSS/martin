import { Injectable } from '@nestjs/common';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class GatewayHelperService {
    private readonly eventEmitter = new ReplaySubject<{ eventName: string, data: any }>();

    publish(eventName: string, data: any) {
        this.eventEmitter.next({ eventName, data });
    }

    asObservable() {
        return this.eventEmitter.asObservable();
    }



}
