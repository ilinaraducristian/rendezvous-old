import FirstPanelButtonComponent from "components/first-panel/FirstPanelButton/FirstPanelButton.component";
import {
    selectServer as selectServerAction,
    setSecondPanelBody,
    setSecondPanelHeader,
} from "state-management/slices/data/data.slice";
import {SecondPanelBodyTypes, SecondPanelHeaderTypes} from "types/UISelectionModes";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {Server} from "dtos/server.dto";

type ComponentProps = {
    server: Server
};

function ServerButtonComponent({server}: ComponentProps) {

    const dispatch = useAppDispatch();
    const selectedServer = useAppSelector(selectSelectedServer);

    function selectServer() {
        dispatch(setSecondPanelHeader(SecondPanelHeaderTypes.channel));
        dispatch(setSecondPanelBody(SecondPanelBodyTypes.channels));
        dispatch(selectServerAction(server.id));
    }

    return (
        <FirstPanelButtonComponent selected={selectedServer?.id === server.id} onClick={selectServer}>
            <span>{server.name[0]}</span>
        </FirstPanelButtonComponent>
    );
}

export default ServerButtonComponent;