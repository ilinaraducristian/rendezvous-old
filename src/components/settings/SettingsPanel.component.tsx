import styles from "./SettingsPanel.module.css";
import XSVG from "svg/XSVG/X.svg";
import ButtonComponent from "components/ButtonComponent";

// const href = `${config.keycloak.url}/realms/${config.keycloak.realm}/account/#/personal-info`;


function SettingsPanelComponent() {
    return (
        <div className={styles.container}>
            <div className={styles.sectionsContainer}>
                <ol className={`list ${styles.sections}`}>
                    <li>
                        <ButtonComponent className={`${styles.sectionButton} ${styles.sectionButtonSelected}`}>
                            My Account
                        </ButtonComponent>
                    </li>
                    <li>User Profile</li>
                    <li>Privacy & Safety</li>
                    <li>Authorized Apps</li>
                    <li>Connections</li>
                </ol>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.content}>test</div>
                <div className={styles.xContainer}>
                    <ButtonComponent className={styles.button}>
                        <XSVG width="18" height="18" className={styles.svg}/>
                    </ButtonComponent>
                    <span>ESC</span>
                </div>
            </div>
        </div>
    );
}

export default SettingsPanelComponent;