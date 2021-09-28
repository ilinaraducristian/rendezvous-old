import {useAppSelector} from "state-management/store";
import {selectServers} from "state-management/selectors/data.selector";
import {Server} from "dtos/server.dto";
import AddServerButtonComponent from "components/first-panel/AddServerButton/AddServerButton.component";
import ServerButtonComponent from "components/first-panel/ServerButton.component";
import HomeButtonComponent from "components/first-panel/HomeButton.component";
import styles from "components/first-panel/FirstPanel/FirstPanel.module.css";

function FirstPanelComponent() {
    const servers = useAppSelector(selectServers);

    return (
        <ol className={`list ${styles.ol}`}>
            <HomeButtonComponent/>
            {servers.map((server: Server, index) =>
                <ServerButtonComponent key={`server_${index}`} server={server}/>,
            )}
            <AddServerButtonComponent/>
        </ol>
    );

}

export default FirstPanelComponent;