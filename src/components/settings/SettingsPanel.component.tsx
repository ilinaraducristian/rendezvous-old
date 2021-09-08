import styled from "styled-components";
import AvatarSVG from "../../svg/Avatar.svg";

function SettingsPanelComponent() {
    return (
        <Div>
            <SidePanelList className="list">
                <Button type="button" className="btn">
                    Account Settings
                </Button>
            </SidePanelList>
            <MainPanelDiv>
                <AvatarSVG width={"80"} height={"72"}/>

            </MainPanelDiv>
        </Div>
    )
}

/* CSS */

const Div = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  color: white;
  background-color: var(--color-secondary);
  display: flex;
`;

const SidePanelList = styled.ol`
  height: 100%;
  background-color: var(--color-third);
  min-width: 15em;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MainPanelDiv = styled.div`
  height: 100%;
  background-color: var(--color-secondary);
  flex-grow: 1;
  overflow-y: auto;
`;

const Button = styled.button`
  font-size: 1.5rem;
`;

/* CSS */

export default SettingsPanelComponent;