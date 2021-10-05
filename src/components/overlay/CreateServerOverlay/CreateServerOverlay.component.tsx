import TransparentBackgroundDivComponent
    from "components/overlay/TransparentBackgroundDiv/TransparentBackgroundDiv.component";
import ButtonComponent from "components/ButtonComponent";
import XSVG from "svg/XSVG/X.svg";
import styles from "./CreateServerOverlay.module.css";
import {useState} from "react";
import {useAppDispatch} from "state-management/store";
import {createServer} from "providers/ReactSocketIO.provider";
import {addServer, addUser, setOverlay} from "state-management/slices/data/data.slice";
import {OverlayTypes} from "types/UISelectionModes";

function CreateServerOverlayComponent() {

    const [serverName, setServerName] = useState("");
    const dispatch = useAppDispatch();

    async function createServerCallback() {
        const data = await createServer({name: serverName});
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
            <div>
                <div className={styles.body}>
                    <ButtonComponent className={styles.styledButton} onClick={closeOverlay}>
                        <XSVG/>
                    </ButtonComponent>
                    <header className={styles.header}>
                        <h2 className={styles.h2}>Customize your server</h2>
                        <h5 className={styles.h5}>Give your new server a personality with a name.</h5>
                    </header>
                    <span className={styles.serverSpan}>SERVER NAME</span>
                    <div className={styles.inputContainer}>
                        <input className={styles.input} onChange={event => setServerName(event.target.value.trim())}/>
                    </div>
                </div>
                <footer className={styles.footer}>
                    <ButtonComponent className={styles.cancelButton} onClick={goBack}>
                        Back
                    </ButtonComponent>
                    <ButtonComponent
                        disabled={serverName.length === 0}
                        className={`${styles.createButton} ${serverName.length === 0 ? styles.createButtonDisabled : ""}`}
                        onClick={createServerCallback}
                    >
                        Create Server
                    </ButtonComponent>
                </footer>
            </div>
        </TransparentBackgroundDivComponent>
    );
}

export default CreateServerOverlayComponent;