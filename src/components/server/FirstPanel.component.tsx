import {useAppDispatch, useAppSelector} from "state-management/store";
import {
    selectServer as selectServerAction,
    setHeader,
    setOverlay as setOverlayAction,
    setSecondPanelBody,
    setSecondPanelHeader
} from "state-management/slices/data/data.slice";
import styled from "styled-components";
import FirstPanelButtonComponent from "components/server/FirstPanelButton.component";
import Server from "types/Server";
import {selectServers} from "state-management/selectors/data.selector";
import {HeaderTypes, OverlayTypes, SecondPanelBodyTypes, SecondPanelHeaderTypes} from "../../types/UISelectionModes";

function FirstPanelComponent() {
    const dispatch = useAppDispatch();
    const servers = useAppSelector(selectServers);

    function selectServer(server: Server) {
        dispatch(setSecondPanelHeader(SecondPanelHeaderTypes.channel));
        dispatch(setSecondPanelBody(SecondPanelBodyTypes.channels));
        dispatch(selectServerAction(server.id));
    }

    function showAddServerOverlay() {
        dispatch(setOverlayAction({type: OverlayTypes.AddServerOverlayComponent}));
    }

    function selectFriends() {
        dispatch(setSecondPanelHeader(SecondPanelHeaderTypes.friends));
        dispatch(setSecondPanelBody(SecondPanelBodyTypes.friends));
        dispatch(setHeader(HeaderTypes.friends));
        dispatch(selectServerAction(null));
    }

    return (
        <Ol className="list">
            <FirstPanelButtonComponent name={"Home"} onClick={selectFriends}/>
            {servers.map((server: Server) =>
                <FirstPanelButtonComponent key={`server_${server.id}`} name={server.name}
                                           onClick={() => selectServer(server)}
                />
            )}
            <FirstPanelButtonComponent name={"+"} onClick={showAddServerOverlay}/>
        </Ol>
    );

}

/* CSS */

const Ol = styled.ol`
  grid-area: first-panel;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: var(--color-primary);
  width: 4.5em;
  overflow-y: auto;
  flex-shrink: 0;
`;

/* CSS */

export default FirstPanelComponent;