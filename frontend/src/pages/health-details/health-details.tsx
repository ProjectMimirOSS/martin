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
import Input from '../../components/input/input';
const HealthDetails = (props: any) => {
  const { state, dispatch } = useContext(GlobalContext);
  const [configureService, setConfigureService] = useState(false);
  const [search, setsearch] = useState('');
  const [serviceListState, setserviceListState] = useState(state.services);
  const [webHook, setwebHook] = useState({id: '',  url: '', edit: false });
  const searchService = (ev: any) => {
    setsearch(ev.target.value);
    setserviceListState(filterService(ev.target.value, Object.values(state.services)));
  }
  const updateWebHookHandler = () => {
    if (!webHook.id) {
      socket.emit('create_new_webhook', {url: webHook.url}); 
    } else {
      socket.emit('update_webhook', {url: webHook.url, id: webHook.id});
    }
    setwebHook({ ...webHook, edit: false })
  }

  const fetchServiceListHandler = () => {
    socket.emit('list_services');
    socket.on('services_list', (data: any) => {
      for (const iterator of data) {
        dispatch({ type: GlobalActions.UPDATE_SERVICE, payload: { services: iterator } })
        dispatch({ type: GlobalActions.UPDATE_SUMMARY, payload: { services: data } })
      }
      console.log(state.services);
    });
  }

  const fetchWebhookHandler = () => {
    socket.emit('list_webhooks');
    socket.on('webhooks_list', (data: any) => {
       setwebHook({ ...data, edit: false })
    });
  }

  const onServiceUpdateListner = () => {
    socket.on('service_update', (data: any) => {
      dispatch({ type: GlobalActions.UPDATE_SERVICE, payload: { services: data } })
      dispatch({ type: GlobalActions.UPDATE_SUMMARY, payload: { services: data } })
    });
    
  }

  useEffect(() => { 
    socket.emit('init');
    socket.on('system_data', (data: any) => {
      dispatch({ type: GlobalActions.UPDATE_STARTTIME, payload: { startedAt: data.startedAt } })
    });
    fetchWebhookHandler();
    fetchServiceListHandler();
    onServiceUpdateListner();
    setserviceListState(state.services);
  }, [state.services]);

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
        <div className={styles.btn__grid}>
          <button onClick={() => { setConfigureService(true) }} className={styles.ans__btn}>Add New Service</button>
          <button onClick={() => { setwebHook({ ...webHook, edit: true }) }} className={styles.ans__btn}>Update Webhook</button>
        </div>
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
      <Dialog isOpen={webHook.edit} >
        <div className={styles.update__webhook__container}>
          <div className={styles.title__container}>
            <p className={styles.title}>Update Webhook</p>
            <button className={styles.save__btn} onClick={() => updateWebHookHandler()}>Save</button>
          </div>
          <div className={styles.dialog__body}>
            <div className={styles.webhook__input}>
              <Input clear value={webHook.url} placeholder="Enter Webhook Url" type="text" name="Webhook Url"
                changed={(val: string) => setwebHook({ ...webHook, url: val })} cleared={(val: string) => setwebHook({ ...webHook, url: '' })}></Input>
            </div>
            <p className={styles.cancel} onClick={() => { setwebHook({ ...webHook, edit: false }) }}>Cancel</p>
          </div>
        </div>
      </Dialog>
    </Fragment>
  );
}

export default HealthDetails;
