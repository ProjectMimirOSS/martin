import React, {  Fragment } from "react"
import styles from './confirmation.module.css';

const Confirmation = (props: any) => {
    const { message, onConfirmation, onCancellation } = props;
    return (
        <Fragment>
            <div className={styles.confirmation__container}>
                <p className={styles.header}>Are you sure?</p>
                <p className={styles.confirmation__txt}>{message}</p>
                <div className={styles.buttons__grid}>
                    <button className={styles.btn} onClick={() => onCancellation()}>Close</button>
                    <button className={styles.btn} onClick={() => onConfirmation()}>Confirm</button>
                </div>
            </div>
        </Fragment>
    );
}

export default Confirmation;