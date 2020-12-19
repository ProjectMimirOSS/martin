import { IEventType } from './../interfaces/event-type.enum';
import { formatTimeStampToDateString, formatTimeStampToTimeString,  msToTime} from './date.util';
export const ServiceResponseMapper = (state: any, data: any) => {
    const _state = { ...state };
    const _lu = data.lastUpAt ?   new Date(data.lastUpAt).getTime() : -1 ;
    const _ld = data.lastDownAt ? new Date(data.lastDownAt).getTime() :  0 ;
    _state.services[data.serviceId] = {
        id: data.serviceId,
        name: data.serviceName,
        isActive: data.active || state?.services[data.serviceId]?.isActive,
        status:  (data.active || state?.services[data.serviceId]?.isActive) ? data.status : IEventType.CODE_REST,
        lastDownTime: data.lastDownAt ? `${formatTimeStampToDateString(new Date(data.lastDownAt).getTime())} ${formatTimeStampToTimeString(new Date(data.lastDownAt).getTime())}` : 'NA',
        lastUpdate: data.updatedAt ? `${formatTimeStampToDateString(new Date(data.updatedAt).getTime())} ${formatTimeStampToTimeString(new Date(data.updatedAt).getTime())}` : 'NA',
        uptime: _lu > _ld ?  msToTime(Date.now() - _lu) : '00:00:00',
        erroredServices: data?.subServices ? Object.values(data?.subServices).filter((_err: any) => _err?.status === 'DOWN').length : 0,
        pingUrl: data.url || state?.services[data.serviceId]?.pingUrl,
        intervalTime: data.interval || state?.services[data.serviceId]?.intervalTime,
        parameters: data?.subServices ? Object.values(data?.subServices).map((_err: any, idx: number) => {
            return {
                id: idx,
                name: Object.keys(data?.subServices)[idx],
                lastDownTime: _err.lastDownAt ? `${formatTimeStampToDateString(new Date(_err.lastDownAt).getTime())} ${formatTimeStampToTimeString(new Date(_err.lastDownAt).getTime())}` : 'NA',
                lastUpdate: _err.lastUpAt ? `${formatTimeStampToDateString(new Date(_err.lastUpAt).getTime())} ${formatTimeStampToTimeString(new Date(_err.lastUpAt).getTime())}`: 'NA',
                status: _err.status,
            }
        }): [],
    }
    return _state;
} 


export const SummaryResponseMapper = (state: any) => {
    const _serviceSummary = { 
        numOfServices: 0,
        numOfDownServices: 0,
        lastUpdate: `${formatTimeStampToDateString(Date.now())} ${formatTimeStampToTimeString(Date.now())}`,
        runTime: '20:00:00'
     };
    Object.values(state.services).forEach((service: any) => {
        if (service.isActive) {
            service.parameters.forEach((parameter: any) => {
                ++_serviceSummary.numOfServices;
                if (parameter?.status === 'DOWN') {
                    ++_serviceSummary.numOfDownServices;
                }
            });
        }
    });
    return _serviceSummary;
}

