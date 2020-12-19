export class IServiceMessage<T> {
    status: IEventType;
    lastUpAt: string;
    lastDownAt: string;
    serviceName: string;
    updatedAt: string;
    subServices: IPongDto;
    pingTAT: number;
    serviceId?: string;
}

export enum IEventType {
    //NO RESPONSE FROM API
    CODE_JUDY = 'CODE_JUDY',
    //ALL SUB SERVICES ARE DOWN
    CODE_GINA = 'CODE_GINA',
    //LESS THAN HALF SUB SERVICES ARE DOWN
    CODE_ROSA = 'CODE_ROSA',
    //MORE THAN HALF SUB SERVICES ARE DOWN
    CODE_JAKE = 'CODE_JAKE',
    //ALL SUB SERVICES ARE UP
    CODE_HOLT = 'CODE_HOLT'
}

export class IPongDto {
    [x: string]: IPongResponseItem;
}

export class IPongResponseItem {
    status: 'UP' | 'DOWN';
    message?: string;
    lastDownAt?: string;
    lastUpAt?: string;
}



