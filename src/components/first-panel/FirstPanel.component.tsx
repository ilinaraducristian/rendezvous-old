import {useAppSelector} from "state-management/store";
import styled from "styled-components";
import {selectServers} from "state-management/selectors/data.selector";
import {Server} from "dtos/server.dto";
import AddServerButtonComponent from "./AddServerButton.component";
import ServerButtonComponent from "./ServerButton.component";
import HomeButtonComponent from "./HomeButton.component";

function FirstPanelComponent() {
    const servers = useAppSelector(selectServers);

    return (
        <Ol className="list">
            <HomeButtonComponent/>
            {servers.map((server: Server, index) =>
                <ServerButtonComponent key={`server_${index}`} server={server}/>,
            )}
            <AddServerButtonComponent/>
        </Ol>
    );

}

/* CSS */

const Ol = styled.ol`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: var(--color-1st);
  width: 72px;
  min-width: 72px;
  max-width: 72px;
  overflow-y: auto;
`;

/* CSS */

export default FirstPanelComponent;