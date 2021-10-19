import SettingsPanelComponent from "components/settings/SettingsPanel.component";

function UserSettingsComponent() {

    return (
        <SettingsPanelComponent categories={[
            {name: "General", children: [{name: "Account settings", body: (<div/>)}]},
        ]}/>
    );
}

export default UserSettingsComponent;