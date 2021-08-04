import {Group} from "../../types";
import GroupComponent from "./Group.component";
import {useAppSelector} from "../../state-management/store";
import {selectGroups} from "../../state-management/slices/serversDataSlice";

function GroupsListComponent() {

  const groups = useAppSelector(selectGroups);

  return <>{
    groups?.map((group: Group) =>
        <GroupComponent key={`group_${group.id}`} id={group.id} name={group.name}/>
    )
  }</>;

}

export default GroupsListComponent;