import {Group} from "../../types";
import GroupComponent from "./Group.component";
import {useContext} from "react";
import {GlobalStates} from "../../state-management/global-state";

function GroupsListComponent() {

  const {state} = useContext(GlobalStates);

  return <>{
    state.groups.filter((group: Group) => group.serverId === state.selectedServer.id)
        .map((group: Group) =>
            <GroupComponent key={`group_${group.id}`} id={group.id} name={group.name}/>
        )
  }</>;

}

export default GroupsListComponent;