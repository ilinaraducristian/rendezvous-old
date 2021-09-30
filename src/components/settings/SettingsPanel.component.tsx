import styled from "styled-components";
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

/* CSS */

const A = styled.a`
  &:link {
    text-decoration: none;
  }

  &:active {
    text-decoration: none;
  }

  &:hover {
    text-decoration: none;
  }

  &:visited {
    text-decoration: none;
  }
`;

const Div = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  color: white;
  background-color: var(--color-2nd);
  display: flex;
`;

const SidePanelList = styled.ol`
  height: 100%;
  background-color: var(--color-3rd);
  min-width: 15em;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MainPanelDiv = styled.div`
  height: 100%;
  background-color: var(--color-2nd);
  flex-grow: 1;
  overflow-y: auto;
`;

const Button = styled.button`
  font-size: 1.5rem;
`;

/* CSS */

export default SettingsPanelComponent;