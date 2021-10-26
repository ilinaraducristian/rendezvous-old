import TransparentBackgroundDivComponent
    from "components/overlay/TransparentBackgroundDiv/TransparentBackgroundDiv.component";
import ButtonComponent from "components/ButtonComponent";
import XSVG from "svg/XSVG/X.svg";
import styles from "./JoinServerOverlay.module.css";
import {useState} from "react";
import {useAppDispatch} from "state-management/store";
import {joinServer} from "providers/socketio";
import {addServer, addUser, setOverlay} from "state-management/slices/data/data.slice";
import {OverlayTypes} from "types/UISelectionModes";

function JoinServerOverlayComponent() {

    const [invitation, setInvitation] = useState("");
    const dispatch = useAppDispatch();

    async function joinServerCallback() {
        if (invitation.length === 0) return;
        const data = await joinServer({invitation});
        dispatch(addServer(data.servers[0]));
        dispatch(addUser(data.users[0]));
        dispatch(setOverlay(null));
    }

    function goBack() {
        dispatch(setOverlay({type: OverlayTypes.AddServerOverlayComponent}));
    }

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
                        <h2 className={styles.h2}>Join a server</h2>
                        <h5 className={styles.h5}>Enter an invitation below to join an existing server</h5>
                    </header>
                    <span className={styles.serverSpan}>INVITATION</span>
                    <div className={styles.inputContainer}>
                        <input className={styles.input} onChange={event => setInvitation(event.target.value.trim())}/>
                    </div>
                </div>
                <footer className={styles.footer}>
                    <ButtonComponent className={styles.cancelButton} onClick={goBack}>
                        Back
                    </ButtonComponent>
                    <ButtonComponent
                        disabled={invitation.length === 0}
                        className={`${styles.createButton} ${invitation.length === 0 ? styles.createButtonDisabled : ""}`}
                        onClick={joinServerCallback}
                    >
                        Join Server
                    </ButtonComponent>
                </footer>
        </TransparentBackgroundDivComponent>
    );
}

export default JoinServerOverlayComponent;