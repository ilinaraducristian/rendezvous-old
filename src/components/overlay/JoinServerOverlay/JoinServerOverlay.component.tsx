import {useRef} from "react";
import {addServer, addUser, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay/Overlay.component";
import {joinServer} from "providers/ReactSocketIO.provider";
import styles from "./JoinServerOverlay.module.css";
import ButtonComponent from "components/ButtonComponent";

function JoinServerOverlayComponent() {

    const ref = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();

    async function joinServerCallback() {
        if (ref.current === null) return;
        const text = ref.current.value;
        if (text.trim().length === 0) return;
        const data = await joinServer({invitation: text});
        dispatch(addServer(data.servers[0]));
        dispatch(addUser(data.users[0]));
        dispatch(setOverlay(null));
    }

    return (
        <OverlayComponent title={"Join a server"} description={"Enter an invite below to join an existing server"}>
            <div className={styles.div}>
                <h5 className={styles.h5}>INVITE LINK</h5>
                <input className={styles.input} type="text" ref={ref}
                       placeholder="86a7bbe5-c049-45da-8992-92f0f9c77cfc"/>
                <ButtonComponent className={styles.button} onClick={joinServerCallback}>
                    Join Server
                </ButtonComponent>
            </div>
        </OverlayComponent>
    );

}

export default JoinServerOverlayComponent;