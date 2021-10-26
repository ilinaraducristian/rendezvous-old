import SettingsPanelComponent from "components/settings/SettingsPanel.component";
import {useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import ServerOverviewSettingsComponent
    from "components/settings/ServerSettings/ServerOverviewSettings/ServerOverviewSettings.component";
import ServerGenericRolesSettingsComponent
    from "components/settings/ServerSettings/ServerRolesSettings/ServerGenericRolesSettings.component";
import {ReactNode, useRef, useState} from "react";
import ServerRolesSettingsComponent
    from "components/settings/ServerSettings/ServerRolesSettings/ServerRolesSettings.component";

function ServerSettingsComponent() {

    const selectedServer = useAppSelector(selectSelectedServer);
    const [rolesSubmenu, setRolesSubmenu] = useState<ReactNode>(<ServerGenericRolesSettingsComponent
        changeRoles={changeDefaultPermissions}/>);
    const overview = useRef(<ServerOverviewSettingsComponent key={'Overview'}/>);

    function goBack() {
        setRolesSubmenu(<ServerGenericRolesSettingsComponent changeRoles={changeDefaultPermissions}/>);
    }

    function changeDefaultPermissions() {
        if (selectedServer === undefined) return;
        setRolesSubmenu(<ServerRolesSettingsComponent key={'Roles'} goBack={goBack}
                                                      selectedRoleIndex={selectedServer.roles.findIndex(role => role.name === 'everyone')}/>)
    }

    return (
        <SettingsPanelComponent categories={[
            {
                name: selectedServer?.name ?? "",
                children: [
                    {name: "Overview", body: (overview.current)},
                    {name: "Roles", body: (rolesSubmenu)}
                ],
            },
        ]}/>
    );
}

export default ServerSettingsComponent;