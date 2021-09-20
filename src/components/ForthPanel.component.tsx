import MemberComponent from "./member/Member.component";
import {useAppSelector} from "state-management/store";
import styled from "styled-components";
import {selectUsers} from "state-management/selectors/data.selector";
import {selectSelectedServerMembers} from "state-management/selectors/server.selector";

function ForthPanelComponent() {

    const users = useAppSelector(selectUsers);
    const selectedMembers = useAppSelector(selectSelectedServerMembers);

    return (
        <Div>
            <ol className="list">
                {
                    selectedMembers.map(member => {
                        const user = users.find(user => user.id === member.userId);
                        return (
                            <MemberComponent key={`member_${member.id}`}
                                             name={`${user?.firstName} ${user?.lastName}`}
                            />
                        );
                    })
                }
            </ol>
        </Div>
    );

}

/* CSS */

const Div = styled.div`
  grid-area: forth-panel;
  width: var(--members-panel-width);
  background-color: var(--color-3rd);
  height: 100%;
  flex-shrink: 0;
  padding-top: 12px;
  padding-left: 8px;
  padding-right: 8px;
`;

/* CSS */

export default ForthPanelComponent;