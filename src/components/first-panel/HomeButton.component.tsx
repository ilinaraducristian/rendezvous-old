import FirstPanelButtonComponent from "components/first-panel/FirstPanelButton/FirstPanelButton.component";
import {
    selectServer as selectServerAction,
    setHeader,
    setSecondPanelBody,
    setSecondPanelHeader,
} from "../../state-management/slices/data/data.slice";
import {HeaderTypes, SecondPanelBodyTypes, SecondPanelHeaderTypes} from "types/UISelectionModes";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSecondPanelHeader} from "state-management/selectors/data.selector";

function HomeButtonComponent() {

    const dispatch = useAppDispatch();
    const selectedFriends = useAppSelector(selectSecondPanelHeader);

    function selectFriends() {
        dispatch(setSecondPanelHeader(SecondPanelHeaderTypes.friends));
        dispatch(setSecondPanelBody(SecondPanelBodyTypes.friends));
        dispatch(setHeader(HeaderTypes.friends));
        dispatch(selectServerAction(null));
    }

    return (
        <FirstPanelButtonComponent selected={selectedFriends === SecondPanelHeaderTypes.friends}
                                   onClick={selectFriends}>
            <span>H</span>
        </FirstPanelButtonComponent>
    );
}

export default HomeButtonComponent;