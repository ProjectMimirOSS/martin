import React, { useState } from "react"
import styles from './add-service.module.css';
import Input from "../input/input";
import ServicePing from "../service-ping/service-ping";
import socket from '../../store/action.helper'
const AddService = (props: any) => {
    const _intitalState = {
        serviceName: props?.serviceName,
        interval: props?.interval,
        url: props?.url,
        event: props?.event,
        id: props?.id,
        response: null,
    };
    const [state, setstate] = useState(_intitalState);
    const updateNameHandler = (ev: any) => {
        setstate({
            ...state,
            serviceName: ev,
        });
    }
    const updateIntervalHandler = (ev: any) => {
        setstate({
            ...state,
            interval: ev,
        });
    }
    const updateUrlHandler = (ev: any) => {
        setstate({
            ...state,
            url: ev,
        });
    }
    const submitClickedHandler = () => {
        if (state.event === 'EDIT') {
            updateServiceHandler()
        } else {
            createServiceHandler()
        }
    }
    const createServiceHandler = () => {
        socket.emit('create_new_service', {
            serviceName: state.serviceName,
            url: state.url,
            interval: +state.interval
        });
        setstate({ ..._intitalState });
        props.onDismiss()
    }
    const pingClickedHandler = () => {
        fetch(state.url).then(res => {
            res.json().then((_res) => {
                setstate({
                    ...state,
                    response: _res,
                }); 
            })
        })
    }
    const updateServiceHandler = () => {
        console.log('Hello', state);
        socket.emit('update_service', {
            serviceName: state.serviceName,
            url: state.url,
            interval: +state.interval,
            serviceId: state.id,
        });
        setstate({ ..._intitalState });
        props.onDismiss()
    }
    return (
        <div className={styles.add__service__component}>
            <div className={styles.title__container}>
                <p className={styles.title}>{state.event === 'EDIT' ? 'Edit' :'Add new'} Service</p>
                <button className={styles.save__btn} onClick={() => submitClickedHandler()}>Save</button>
            </div>
            <div className={styles.body__section}>
                <div className={styles.service__section}>
                    <div className={styles.service__name__ip}>
                        <Input clear value={state.serviceName} placeholder="Enter Service Name" type="text" name="search" changed={updateNameHandler} cleared={updateNameHandler}></Input>
                    </div>
                    <ServicePing hideInterval={false}
                        pingInterval={state.interval}
                        pingUrl={state.url}
                        intervalUpdated={updateIntervalHandler}
                        urlUpdated={updateUrlHandler}
                        pingClicked={pingClickedHandler}
                    ></ServicePing>
                </div>
                {/* <div className={styles.response__section}>
                    <h3 className={styles.subtitle}>PARAMETERS</h3>
                    <div className={styles.parameter__list}>
                        {[1, 2, 3, 4, 5, 6, 7].map(el => <p className={styles.parameter} key={el}>Parameter</p>)}
                    </div>

                </div> */}
                {
                   state.response ? <div className={styles.response__section}>
                        <h3 className={styles.subtitle}>RESULT</h3>
                        <code>
                            <pre>{JSON.stringify(state.response, null, 2)}</pre>
                        </code>
                    </div> : null
                }
                <p className={styles.cancel} onClick={() => {
                    setstate({..._intitalState});
                    props.onDismiss()
                }}>Cancel</p>
            </div>
        </div>
    )
}

export default AddService;