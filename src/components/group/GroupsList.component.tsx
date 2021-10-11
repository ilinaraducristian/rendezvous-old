import GroupComponent from "components/group/Group.component";
import {useAppSelector} from "state-management/store";

import {selectSelectedServerGroups} from "state-management/selectors/server.selector";
import {Group} from "dtos/group.dto";
import GroupDropHandleComponent from "components/group/GroupDropHandle.component";

function GroupMapper(group: Group, index: number) {
    return [
        <GroupComponent key={`group_${group.id}`} group={group}/>,
        <GroupDropHandleComponent key={`group_drop-handle_${index + 1}`} index={index + 1}/>,
    ];
}

function GroupsListComponent() {

    const groups = Array.from(useAppSelector(selectSelectedServerGroups));

    return (<>
        <GroupDropHandleComponent key={`group_drop-handle_0`} index={0}/>
        {groups.sort(({order: order1}, {order: order2}) => order1 - order2)
            .map(GroupMapper).flat(2)}
    </>);

}

export default GroupsListComponent;