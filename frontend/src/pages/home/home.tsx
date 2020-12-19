import React, { Fragment, useContext } from 'react';
import styles from './home.module.css';
import { GlobalContext } from '../../store/global.provider';
import GlobalActions from '../../store/actions.enum';
const Home = (props: any) => {
  const { state, dispatch } = useContext(GlobalContext);
  return (
    <Fragment>
      <nav>
        <div className="app__logo">PROJECT MARTIN</div>
        <div className={styles.user__data}>
          <div className={styles.user__info}>
            <p className={styles.user__name}>Navadeep Raja</p>
            <p className={styles.logout}>Logout</p>
          </div>
          <div className={styles.user__icon}><span className={`material-icons`}>person</span></div>
          <div className={styles.toggle__theme}>
            <span title= "Switch Theme" className="material-icons" onClick={() => dispatch({ type: GlobalActions.UPDATE_THEME })}> {state.isDarkThemed ? 'brightness_7' : 'brightness_4'} </span>
          </div>
        </div>
      </nav>
      <section className={styles.content__area}>
        {props.children}
      </section>
    </Fragment>
  );
}

export default Home;
