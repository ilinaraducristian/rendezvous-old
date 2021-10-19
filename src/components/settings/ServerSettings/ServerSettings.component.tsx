import SettingsPanelComponent from "components/settings/SettingsPanel.component";
import {useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import ServerOverviewSettingsComponent
    from "components/settings/ServerSettings/ServerOverviewSettings/ServerOverviewSettings.component";

function ServerSettingsComponent() {

    const selectedServer = useAppSelector(selectSelectedServer);

    return (
        <SettingsPanelComponent categories={[
            {
                name: selectedServer?.name ?? "",
                children: [{name: "Overview", body: (<ServerOverviewSettingsComponent/>)}],
            },
        ]}/>
    );
}

export default ServerSettingsComponent;