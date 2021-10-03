import {useRef} from "react";

import {addServer, addUser, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay/Overlay.component";
import {createServer} from "providers/ReactSocketIO.provider";
import styles from "components/overlay/CreateServerOverlay/CreateServerOverlay.module.css";
import ButtonComponent from "components/ButtonComponent";

function CreateServerOverlayComponent() {
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLInputElement>(null);

    async function createServerCallback() {
        if (ref.current === null) return;
        const data = await createServer({name: ref.current.value});
        dispatch(addServer(data.servers[0]));
        dispatch(addUser(data.users[0]));
        dispatch(setOverlay(null));
    }

    return (
        <OverlayComponent>
            <h1>Create a server</h1>
            <div className={styles.div}>
                <input type="text" ref={ref}/>
                <ButtonComponent className="btn__overlay-select" onClick={createServerCallback}>Create
                </ButtonComponent>
            </div>
        </OverlayComponent>
    );

}

export default CreateServerOverlayComponent;