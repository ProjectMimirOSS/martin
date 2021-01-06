import React from 'react'
import styles from './service-ping.module.css'

const ServicePing = (props: any) => {
    const { pingInterval, pingUrl, hideInterval = true, intervalUpdated, urlUpdated, pingClicked, showPing } = props;
    return (
        <div className={styles.service__ping__container}>
            <div className={styles.ping__input}>
                <p className={styles.label}>Enter the URL</p>
                <div className={styles.input__container}> <input className={styles.input__fld} value={pingUrl} onChange={(ev) => urlUpdated(ev ?.target ?.value)} /> {showPing ? <span onClick={() => pingClicked()}>PING</span> : null}</div>
            </div>
            {!hideInterval ? <div className={styles.interval__input}>
                <p className={styles.label}>Set Interval</p>
                <div className={styles.input__container}> <input className={styles.input__fld} type='number' value={pingInterval} onChange={(ev) => intervalUpdated(+ev?.target?.value)} /></div>
            </div> : null}
        </div>
    )
}

export default ServicePing;