import FirstPanelButtonComponent from "./FirstPanelButton.component";
import Plus2SVG from "../../svg/Plus2.svg";
import {setOverlay as setOverlayAction} from "../../state-management/slices/data/data.slice";
import {OverlayTypes} from "../../types/UISelectionModes";
import {useAppDispatch} from "../../state-management/store";
import styled from "styled-components";

function AddServerButtonComponent() {

    const dispatch = useAppDispatch();

    function showAddServerOverlay() {
        dispatch(setOverlayAction({type: OverlayTypes.AddServerOverlayComponent}));
    }

    return (
        <FirstPanelButtonComponent selected={false} onClick={showAddServerOverlay}>
            <Svg/>
        </FirstPanelButtonComponent>
    );
}

/* CSS */

const Svg = styled(Plus2SVG)`
  color: var(--color-18th);
`;

/* CSS */

export default AddServerButtonComponent;