import MemberComponent from "./Member.component";
import {useAppSelector} from "../../state-management/store";
import {selectMembers, selectUsers} from "../../state-management/slices/serversDataSlice";

function MembersPanelComponent() {

  const users = useAppSelector(selectUsers);
  const selectedMembers = useAppSelector(selectMembers);

  return (
      <div className="content__body__members">
        <ol className="list">
          {
            selectedMembers?.map(member =>
                <MemberComponent key={`member_${member.id}`}
                                 name={users.find(user => user.id === member.userId)?.firstName || ""}/>
            )
          }
        </ol>
      </div>
  );

}

export default MembersPanelComponent;