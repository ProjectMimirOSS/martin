import React, { useContext } from "react"
import styles from './dialog.module.css';
import ReactDOM from "react-dom";
import { GlobalContext } from "../../store/global.provider";

const Dialog = (props: any) => {
    const { state } = useContext(GlobalContext);
    // const closeDialog = () => {
    //     props.onDismiss();
    // }
    if (!props.isOpen) return null;
    return ReactDOM.createPortal(
        <div className={`${styles.app} ${state.isDarkThemed ? 'dark' : 'light'}`}>
            <div className={styles.overlay}>
                <div className={styles.dialog}>
                    {/* <div className={styles.closing__section}>
                        <span className="material-icons" onClick={closeDialog}> cancel </span>
                    </div> */}
                    <div className={styles.data__section}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>,
        (document.getElementById('portal') as Element)
    )
}

export default Dialog;