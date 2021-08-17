import GroupComponent from "components/group/Group.component";
import {useAppSelector} from "state-management/store";
import Group from "types/Group";
import {selectGroups} from "state-management/selectors";

function GroupsListComponent() {

  const groups = useAppSelector(selectGroups);

  return <>{
    groups?.map((group: Group) =>
        <GroupComponent key={`group_${group.id}`} id={group.id} name={group.name}/>
    )
  }</>;

}

export default GroupsListComponent;