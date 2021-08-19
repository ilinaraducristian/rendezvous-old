import MemberComponent from "./Member.component";
import {useAppSelector} from "state-management/store";
import styled from "styled-components";
import {selectUsers} from "state-management/selectors/data.selector";
import {selectSelectedServerMembers} from "state-management/selectors/server.selector";

function MembersPanelComponent() {

  const users = useAppSelector(selectUsers);
  const selectedMembers = useAppSelector(selectSelectedServerMembers);

  return (
      <Div>
        <ol className="list">
          {
            selectedMembers.map(member =>
                <MemberComponent key={`member_${member.id}`}
                                 name={users.find(user => user.id === member.userId)?.firstName || ""}
                />
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