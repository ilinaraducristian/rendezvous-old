import {setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay/Overlay.component";
import {OverlayTypes} from "types/UISelectionModes";
import styles from "./AddServerOverlay.module.css";
import ButtonComponent from "components/ButtonComponent";

function AddServerOverlayComponent() {
    const dispatch = useAppDispatch();

    function createServer() {
        dispatch(setOverlay({type: OverlayTypes.CreateServerOverlayComponent}));
    }

    function joinServer() {
        dispatch(setOverlay({type: OverlayTypes.JoinServerOverlayComponent}));
    }

    return (
        <OverlayComponent title="Add a server">
            <div className={styles.div}>
                <ButtonComponent className={styles.button} onClick={createServer}>
                    Create a new server
                </ButtonComponent>
                <ButtonComponent className={styles.button} onClick={joinServer}>
                    Join a server
                </ButtonComponent>
            </div>
        </OverlayComponent>
    );

}

export default AddServerOverlayComponent;