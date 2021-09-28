import styled from "styled-components";
import AvatarWithStatusSVG from "svg/AvatarWithStatus/AvatarWithStatus.svg";
import config from "../../config";

const href = `${config.keycloak.url}/realms/${config.keycloak.realm}/account/#/personal-info`;

function SettingsPanelComponent() {
    return (
        <Div>
            <SidePanelList className="list">
                <Button type="button" className="btn">
                    Account Settings
                </Button>
            </SidePanelList>
            <MainPanelDiv>
                <AvatarWithStatusSVG width={"80"} height={"72"}/>
                <A href={href} className="btn">
                    Edit Profile
                </A>
            </MainPanelDiv>
        </Div>
    )
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
`

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