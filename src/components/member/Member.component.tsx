import AvatarWithStatusSVG from "svg/AvatarWithStatus/AvatarWithStatus.svg";
import ButtonComponent from "components/ButtonComponent";
import styles from "./Member.module.css";

type ComponentProps = {
    name: string
}

function MemberComponent({name}: ComponentProps) {
    return (
        <li>
            <ButtonComponent className={styles.button}>
                <AvatarWithStatusSVG/>
                <span>{name}</span>
            </ButtonComponent>
        </li>
    );
}

export default MemberComponent;
