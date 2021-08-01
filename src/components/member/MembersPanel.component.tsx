import MemberComponent from "./Member.component";
import {User} from "../../types";
import {useAppSelector} from "../../state-management/store";
import {selectMembers, selectSelectedServer, selectUsers} from "../../state-management/slices/serversDataSlice";

function MembersPanelComponent() {

  const members = useAppSelector(selectMembers);
  const users = useAppSelector(selectUsers);
  const selectedServer = useAppSelector(selectSelectedServer);

  return (
      <div className="content__body__members">
        <ol className="list">
          {
            members
                .filter(member => member.serverId === selectedServer?.id)
                .map(member =>
                    <MemberComponent key={`member_${member.id}`} name={(users.get(member.userId) as User).firstName}/>
                )
          }
        </ol>
      </div>
  );

}

export default MembersPanelComponent;