import FirstPanelButtonComponent from "components/first-panel/FirstPanelButton/FirstPanelButton.component";
import Plus2SVG from "svg/Plus2.svg";
import {setOverlay as setOverlayAction} from "state-management/slices/data/data.slice";
import {OverlayTypes} from "types/UISelectionModes";
import {useAppDispatch} from "state-management/store";
import styles from "components/first-panel/AddServerButton/AddServerButton.module.css";

function AddServerButtonComponent() {

    const dispatch = useAppDispatch();

    function showAddServerOverlay() {
        dispatch(setOverlayAction({type: OverlayTypes.AddServerOverlayComponent}));
    }

    return (
        <FirstPanelButtonComponent selected={false} onClick={showAddServerOverlay}>
            <Plus2SVG className={styles.svg}/>
        </FirstPanelButtonComponent>
    );
}

export default AddServerButtonComponent;