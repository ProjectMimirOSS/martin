import React, { Fragment, useState, useContext, useEffect } from 'react';
import styles from './health-details.module.css';
import ServiceCard from '../../components/service-card/service-card';
import SummaryCard from '../../components/summary-card/summary-card';
import Dialog from '../../components/dialog/dialog';
import AddService from '../../components/add-service/add-service';
import { GlobalContext } from '../../store/global.provider';
import socket from '../../store/action.helper';
import GlobalActions from '../../store/actions.enum';
import { filterService } from '../../util/filter.util';
import Confirmation from '../../components/confirmation/confirmation';
const HealthDetails = (props: any) => {
  const { state, dispatch } = useContext(GlobalContext);
  const [configureService, setConfigureService] = useState(false);
  const [search, setsearch] = useState('');
  const [serviceListState, setserviceListState] = useState(state.services);
  const searchService = (ev: any) => {
    setsearch(ev.target.value);
    setserviceListState(filterService(ev.target.value, Object.values(state.services)));
  }
  useEffect(() => {
    socket.emit('init');
    socket.on('init', (data: any) => {
      console.log(data);
    });
    socket.emit('list_services');
    socket.on('services_list', (data: any) => {
      for (const iterator of data) {
        dispatch({ type: GlobalActions.UPDATE_SERVICE, payload: { services: iterator } })
        dispatch({ type: GlobalActions.UPDATE_SUMMARY, payload: { services: data } })
      }
    });
    socket.on('service_update', (data: any) => {
      dispatch({ type: GlobalActions.UPDATE_SERVICE, payload: { services: data } })
      dispatch({ type: GlobalActions.UPDATE_SUMMARY, payload: { services: data } })
    });
    setserviceListState(state.services);
  }, [state.services, dispatch]);

  return (
    <Fragment>
      <div className={styles.summary__grid}>
        <SummaryCard type='SUMMARY' report={state.summaryReport}></SummaryCard>
        <SummaryCard type='ERROR' report={state.summaryReport}></SummaryCard>
      </div>
      <div className={styles.search__add}>
        <div className={styles.search__ip}>
          <p className={styles.label}>Search</p>
          <div className={styles.input__container}>
            <input className={styles.input__fld} value={search} onChange={searchService} />
          </div>
        </div>
        <button onClick={() => { setConfigureService(true) }} className={styles.ans__btn}>Add New Service</button>
      </div>
      <div className={styles.service__titles}>
        <p><b>Service</b></p>
        <p><b>Last Downtime</b></p>
        <p><b>Last Check</b></p>
        <p><b>Uptime</b></p>
        <p><b>Error</b></p>
        <p><b>Actions</b></p>
      </div>
      {Object.values(serviceListState).map((el: any) => <ServiceCard key={el.id} service={el}></ServiceCard>)}
      <Dialog isOpen={configureService} >
        <AddService onDismiss={() => { setConfigureService(false) }}></AddService>
      </Dialog>
    </Fragment>
  );
}

export default HealthDetails;
