import TransparentBackgroundDivComponent
    from "components/overlay/TransparentBackgroundDiv/TransparentBackgroundDiv.component";
import ButtonComponent from "components/ButtonComponent";
import XSVG from "svg/XSVG/X.svg";
import styles from "./AddServerOverlay.module.css";
import {ArrowSVG} from "svg/Arrow/Arrow.svg";
import {useAppDispatch} from "state-management/store";
import {setOverlay} from "state-management/slices/data/data.slice";
import {OverlayTypes} from "types/UISelectionModes";

function AddServerOverlayComponent() {

    const dispatch = useAppDispatch();

    function createServer() {
        dispatch(setOverlay({type: OverlayTypes.CreateServerOverlayComponent}));
    }

    function joinServer() {
        dispatch(setOverlay({type: OverlayTypes.JoinServerOverlayComponent}));
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
                        <h2 className={styles.h2}>Add a server</h2>
                        <h5 className={styles.h5}>
                            Your server is where you and your friends hang out. Make yours and
                            start talking.
                        </h5>
                    </header>
                    <ButtonComponent
                        className={`${styles.serverButton} ${styles.marginTop}`}
                        onClick={createServer}
                    >
                        <h3 className={styles.h3}>Create a new server</h3>
                        <ArrowSVG/>
                    </ButtonComponent>
                    <ButtonComponent
                        className={`${styles.serverButton}`}
                        onClick={joinServer}
                    >
                        <h3 className={styles.h3}>Add an existing server</h3>
                        <ArrowSVG/>
                    </ButtonComponent>
                </div>
        </TransparentBackgroundDivComponent>
    );
}

export default AddServerOverlayComponent;