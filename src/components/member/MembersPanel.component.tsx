import MemberComponent from "./Member.component";
import {useAppSelector} from "state-management/store";
import styled from "styled-components";
import {selectMembers, selectUsers} from "state-management/selectors";

function MembersPanelComponent() {

  const users = useAppSelector(selectUsers);
  const selectedMembers = useAppSelector(selectMembers);

  return (
      <Div>
        <ol className="list">
          {
            selectedMembers?.map(member =>
                <MemberComponent key={`member_${member.id}`}
                                 name={users.find(user => user.id === member.userId)?.firstName || ""}/>
            )
          }
        </ol>
      </Div>
  );

}

/* CSS */

const Div = styled.div`
  width: var(--members-panel-width);
  background-color: var(--color-third);
  height: 100%;
  flex-shrink: 0;
`;

/* CSS */

export default MembersPanelComponent;