import {useAppSelector} from "state-management/store";
import {selectUsers} from "state-management/selectors/data.selector";
import {selectSelectedServerMembers} from "state-management/selectors/server.selector";
import styles from "./ForthPanel.module.css";
import MemberComponent from "components/member/Member.component";

function ForthPanelComponent() {

    const users = useAppSelector(selectUsers);
    const selectedMembers = useAppSelector(selectSelectedServerMembers);

    return (
        <div className={styles.div}>
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
        </div>
    );

}

export default ForthPanelComponent;