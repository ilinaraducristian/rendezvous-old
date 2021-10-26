import styles from "components/settings/ServerSettings/ServerRolesSettings/ServerGenericRolesSettings.module.css";
import ButtonComponent from "components/ButtonComponent";
import {ArrowSVG} from "svg/Arrow/Arrow.svg";
import PeopleSVG from "svg/People.svg";

function ServerGenericRolesSettingsComponent({changeRoles}: any) {

    // const dispatch = useAppDispatch();
    //
    // function createNewRole() {
    //
    // }

    return (
        <div className={styles.div}>
            <h3>Roles</h3>
            <ButtonComponent className={styles.defaultPermissionsButton} onClick={changeRoles}>
                <PeopleSVG className={styles.peopleSvg}/>
                <h4 className={styles.title}>Default Permissions</h4>
                <h5 className={styles.subtitle}>applied to all server members</h5>
                <ArrowSVG className={styles.arrowSvg}/>
            </ButtonComponent>
        </div>
    );
}

export default ServerGenericRolesSettingsComponent;