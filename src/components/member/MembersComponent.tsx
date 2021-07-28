import {useContext} from "react";
import {GlobalStates} from "../../state-management/global-state";
import MemberComponent from "./MemberComponent";
import {User} from "../../types";

function MembersComponent() {

  const {state} = useContext(GlobalStates);

  return (
      <div className="content__body__members">
        <ol className="list">
          {
            state.members
                .filter(member => member.serverId === state.selectedServer.id)
                .map(member => {
                  const user = state.users.get(member.userId) as User;
                  return <MemberComponent key={`member_${member.id}`} name={user.firstName || ""}/>;
                })
          }
        </ol>
      </div>
  );

}

export default MembersComponent;