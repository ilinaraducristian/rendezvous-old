import {useCallback, useState} from "react";
import {setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay/Overlay.component";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import XSVG from "svg/XSVG/X.svg";
import styles from "components/overlay/InvitationOverlay/InvitationOverlay.module.css";
import ButtonComponent from "components/ButtonComponent";

type ComponentProps = {
    invitation: string
}

function InvitationOverlayComponent({invitation}: ComponentProps) {

    const selectedServer = useAppSelector(selectSelectedServer);
    const [status, setStatus] = useState("Copy");
    const dispatch = useAppDispatch();

    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(invitation);
            setStatus("Copied");
        } catch (e) {
            console.error(e);
            setStatus("Error");
        }
    }, [invitation]);

    function close() {
        dispatch(setOverlay(null));
    }

    return (
        <OverlayComponent>
            <div className={styles.container}>
                <div className={styles.firstRow}>
                    <span className={styles.span}>INVITE FRIENDS TO {selectedServer?.name}</span>
                    <button className="btn" type="button" onClick={close}><XSVG/></button>
                </div>
                <h5 className={styles.h5}>SEND A SERVER INVITE LINK TO A FRIEND</h5>
                <div className={styles.thirdRow}>
                    <span className={styles.span}>{invitation}</span>
                    <ButtonComponent className={styles.button} onClick={copyToClipboard}>{status}</ButtonComponent>
                </div>
            </div>
        </OverlayComponent>
    );

}

export default InvitationOverlayComponent;
