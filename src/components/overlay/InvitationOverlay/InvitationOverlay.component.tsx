import TransparentBackgroundDivComponent
    from "components/overlay/TransparentBackgroundDiv/TransparentBackgroundDiv.component";
import ButtonComponent from "components/ButtonComponent";
import XSVG from "svg/XSVG/X.svg";
import styles from "./InvitationOverlay.module.css";
import {useCallback, useState} from "react";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {setOverlay} from "state-management/slices/data/data.slice";

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

    function closeOverlay() {
        dispatch(setOverlay(null));
    }

    return (
        <TransparentBackgroundDivComponent>
                <div className={styles.body}>
                    <ButtonComponent className={styles.styledButton} onClick={closeOverlay}>
                        <XSVG/>
                    </ButtonComponent>
                    <header className={styles.header}>
                        <h3 className={styles.h3}>INVITE FRIENDS TO {selectedServer?.name}</h3>
                    </header>
                    <span className={styles.groupSpan}>SEND A SERVER INVITE LINK TO A FRIEND</span>
                    <div className={styles.inputContainer}>
                        <input
                            value={invitation}
                            className={styles.input}
                        />
                        <ButtonComponent
                            className={`${styles.createButton}`}
                            onClick={copyToClipboard}
                        >
                            {status}
                        </ButtonComponent>
                    </div>
                </div>
        </TransparentBackgroundDivComponent>
    );
}

export default InvitationOverlayComponent;