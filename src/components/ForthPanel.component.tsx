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
                    selectedMembers.map((member, index) => {
                        const user = users.find(user => user.id === member.userId);
                        return (
                            <MemberComponent
                                key={`member_${index}`}
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
  width: 240px;
  min-width: 240px;
  background-color: var(--color-3rd);
  height: 100%;
  padding-top: 12px;
  padding-left: 8px;
  padding-right: 8px;
`;

/* CSS */

export default ForthPanelComponent;