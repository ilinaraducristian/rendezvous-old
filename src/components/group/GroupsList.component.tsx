import {Group} from "../../types";
import GroupComponent from "./Group.component";
import {useAppSelector} from "../../state-management/store";
import {selectGroups, selectSelectedServer} from "../../state-management/slices/serversDataSlice";

function GroupsListComponent() {

  const selectedServer = useAppSelector(selectSelectedServer);
  const groups = useAppSelector(selectGroups);

  return <>{
    groups.filter((group: Group) => group.serverId === selectedServer?.id)
        .map((group: Group) =>
            <GroupComponent key={`group_${group.id}`} id={group.id} name={group.name}/>
        )
  }</>;

}

export default GroupsListComponent;