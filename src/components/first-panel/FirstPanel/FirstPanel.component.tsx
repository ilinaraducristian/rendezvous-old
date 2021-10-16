import {useAppSelector} from "state-management/store";
import {selectServers} from "state-management/selectors/data.selector";
import {Server} from "dtos/server.dto";
import AddServerButtonComponent from "components/first-panel/AddServerButton/AddServerButton.component";
import ServerButtonComponent from "components/first-panel/ServerButton.component";
import HomeButtonComponent from "components/first-panel/HomeButton.component";
import styles from "components/first-panel/FirstPanel/FirstPanel.module.css";
import ServerDropHandleComponent from "components/first-panel/ServerDropHandle.component";

function FirstPanelComponent() {
    const servers = useAppSelector(selectServers);

    return (
        <ol className={`list ${styles.ol}`}>
            <HomeButtonComponent/>
            <ServerDropHandleComponent key={`server_drop-handle_0`} index={0}/>
            {Array.from(servers).sort((s1, s2) => s1.order - s2.order).map((server: Server, index) =>
                [
                    <ServerButtonComponent key={`server_${index}`} server={server}/>,
                    <ServerDropHandleComponent key={`server_drop-handle_${index + 1}`} index={index + 1}/>,
                ],
            ).flat()}
            <AddServerButtonComponent/>
        </ol>
    );

}

export default FirstPanelComponent;