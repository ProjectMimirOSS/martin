import React, { useState, Fragment } from "react"
import styles from './service-card.module.css';
import ServicePing from "../service-ping/service-ping";
import Dialog from "../dialog/dialog";
import AddService from "../add-service/add-service";
import { IEventColors } from "../../interfaces/event-colors.enum";
import Confirmation from "../confirmation/confirmation";
import socket from "../../store/action.helper";
import { IEventType } from "../../interfaces/event-type.enum";
const ServiceCard = (props: any) => {
    const _intialState = {
        pingUrl: '',
        intervalTime: undefined,
        name: '',
        id: ''
    };
    const { service, displayDetails } = props;
    const [configureService, setConfigureService] = useState(_intialState);
    const [deleteService, setdeleteService] = useState(_intialState);
    const [showDetails, setshowDetails] = useState(displayDetails || false);
    const servicePauseHandler = () => {
        socket.emit('update_service', {
            serviceName: service.name,
            url: service.url,
            interval: +service.intervalTime,
            serviceId: service.id,
            active: service.status === IEventType.CODE_REST ? true : false,
        });
        setdeleteService({ ..._intialState });
    }
    return (
        <Fragment>
            <div className={styles.service__card}>
                <div className={styles.service__list__item} onClick={() => setshowDetails(!showDetails)}>
                    <div className={styles.status__indicator} style={{ background: (IEventColors as any)[service.status] }}></div>
                    <div className={styles.list__data}>
                        <div className={styles.service__name}><div className={styles.service__letter} style={{ background: (IEventColors as any)[service.status] }}>{service?.name?.substr(0, 1)}</div> {service.name} </div>
                        <p className={styles.service__last__down}>
                            {service.lastDownTime.split(' ')[0]}<br></br>{service.lastDownTime.split(' ')[1]}
                        </p>
                        <p className={styles.service__updated_at}> {service.lastUpdate.split(' ')[0]}<br></br>{service.lastUpdate.split(' ')[1]}</p>
                        <p className={styles.uptime}>{service.uptime}</p>
                        <p className={styles.errors}>{service.erroredServices} Errors </p>
                        <div className={styles.actions}>
                            {service.status !== IEventType.CODE_REST ? <div className="material-icons" style={{ color: 'var(--martin-color-danger-tint)' }} onClick={(event) => { event.stopPropagation(); setConfigureService(service) }}>settings</div> : ''}
                            <div className="material-icons"
                                onClick={(event) => { event.stopPropagation(); setdeleteService(service) }}
                                style={{ color: 'var(--martin-color-medium-tint)' }}>{service.status === IEventType.CODE_REST ? 'play_circle_outline' : 'pause_circle_outline'}</div></div>
                    </div>
                </div>
                {showDetails ? <div className={styles.service__details}>
                    <ServicePing
                        pingInterval={service.intervalTime}
                        pingUrl={service.pingUrl}
                    ></ServicePing>
                    <div className={styles.service__parmeters}>
                        <div className={styles.parameter__item}>
                            <p><b>PARAMETER</b></p>
                            <p><b>STATUS</b></p>
                            <p><b>LAST DOWNTIME</b></p>
                            <p><b>LAST UPDATE</b></p>
                        </div>
                        <div className={styles.parameter__list}>
                            {service.parameters.map((el: any) => (
                                <div className={styles.parameter__item} key={el.id}>
                                    <p className={styles.parameter__name}>{el.name}</p>
                                    <p className={styles.parameter__status}>{el.status}</p>
                                    <p className={styles.last__down}>{el.lastDownTime}</p>
                                    <p className={styles.updated_at}>{el.lastUpdate}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> : null}
            </div>
            <Dialog isOpen={configureService.id} >
                <AddService
                    onDismiss={() => { setConfigureService(_intialState) }}
                    serviceName={configureService?.name}
                    interval={configureService?.intervalTime}
                    url={configureService?.pingUrl}
                    id={configureService?.id}
                    event="EDIT"
                ></AddService>
            </Dialog>
            <Dialog isOpen={deleteService.id} >
                <Confirmation
                    message={`You are about to ${service.status === IEventType.CODE_REST ? 'start' : 'pause'} ${deleteService.name} service?`}
                    onConfirmation={() => { servicePauseHandler() }}
                    onCancellation={() => { setdeleteService(_intialState) }}
                ></Confirmation>
            </Dialog>
        </Fragment>
    )
}

export default ServiceCard;