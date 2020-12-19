import React, { Fragment } from "react";
import styles from './summary-card.module.css';

const SummaryCard = (props: any) => {
    const { type, report } = props;
    let title = null;
    let representation = [];
    if (type === 'SUMMARY') {
        title = 'Overall System Health';
        representation = [
            {
                title: 'No.of Services',
                value: report.numOfServices,
            },
            {
                title: 'Running Time',
                value: report.runTime,
            },
            {
                title: 'Total Errors',
                value: report.numOfDownServices,
            }
        ]


    } else {
        title = 'Error Summary';
        representation = [
            {
                title: 'No.of Error',
                value: report.numOfDownServices,
            },
            {
                title: 'Last Update',
                value: report.lastUpdate,
            }
        ]
    }

    return <Fragment>
        <div className={styles.summary__card}>
            <div className={styles.title__section}>
                <h3 className="title">{title}</h3>
                <p className="status__icon">
                    <span className='material-icons' style={{ color: `${report?.numOfDownServices <= 0 ? 'var(--martin-color-success)' : 'var(--martin-color-warning)'}` }}>  {report?.numOfDownServices > 0 ? 'warning' : 'check_circle_outline'} </span>
                </p>
            </div>
            <div className={styles.details__section}>
                {representation.map((el, idx) => <div className={styles.details__item} key={idx}>
                    <p className={styles.details__title}>{el.title}</p>
                    <p className={styles.details__value}>{el.value}</p>
                </div>)}
            </div>
            <div className={styles.status__section} style={{ background: `${report?.numOfDownServices <= 0 ? 'var(--martin-color-success)' : 'var(--martin-color-warning)'}` }}></div>
        </div>
    </Fragment>
};
export default SummaryCard;