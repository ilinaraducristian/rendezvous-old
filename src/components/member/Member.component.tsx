import AvatarWithStatusSVG from "svg/AvatarWithStatus/AvatarWithStatus.svg";
import ButtonComponent from "components/ButtonComponent";
import styles from "./Member.module.css";
import {User} from "dtos/user.dto";

type ComponentProps = {
    user?: User
}

function MemberComponent({user}: ComponentProps) {
    if (user === undefined) return (<></>);
    return (
        <li>
            <ButtonComponent className={styles.button}>
                <AvatarWithStatusSVG status={user.status}/>
                <span>{`${user?.firstName} ${user?.lastName}`}</span>
            </ButtonComponent>
        </li>
    );
}

export default MemberComponent;
