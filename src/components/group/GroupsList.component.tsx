import GroupComponent from "components/group/Group.component";
import {useAppSelector} from "state-management/store";

import {selectSelectedServerGroups} from "state-management/selectors/server.selector";
import {Group} from "../../dtos/group.dto";

function GroupsListComponent() {

  const groups = useAppSelector(selectSelectedServerGroups);

  return <>{
    groups.map((group: Group) =>
        <GroupComponent key={`group_${group.id}`} id={group.id} name={group.name}/>
    )
  }</>;

}

export default GroupsListComponent;