import styled from "styled-components";
import EndCallSVG from "svg/EndCall/EndCall.svg";
import ScreenSVG from "../../svg/Screen.svg";

function SecondPanelVoiceComponent() {
    return (
        <Div>
            <FirstRow>
                <RTCStatus>RTC Connecting</RTCStatus>
                <EndCallButton type="button" className="btn">
                    <EndCallSVG/>
                </EndCallButton>
            </FirstRow>
            <SecondRow>
                <ButtonComponent type="video"/>
                <ButtonComponent type="screen"/>
            </SecondRow>
        </Div>
    );
}


/* CSS */

const Div = styled.div`
  width: 100%;
  height: 90px;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  padding: 8px;
`;

const FirstRow = styled.div`
  display: flex;
  width: 100%;
  height: 36px;
  min-height: 36px;
`;

const RTCStatus = styled.span`
  color: var(--color-18th);
  flex-grow: 1;
`;

const EndCallButton = styled.button`
  width: 32px;
  height: 32px;
`;

const SecondRow = styled.div`
  height: 36px;
  min-height: 36px;
  display: flex;
  justify-content: space-evenly;
`;

const Button = styled.button<{ margin: string }>`
  height: 32px;
  min-height: 32px;
  width: 100%;
  background-color: var(--color-2nd);
  border: 0;
  border-radius: 4px;
  padding: 2px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.margin === "left" ? "margin-left: 4px;" : "margin-right: 4px;"}
`;

/* CSS */

function ButtonComponent({type}: { type: string }) {
    if (type === "video") {
        return (
            <Button type="button" className="btn" margin="right">
                <ScreenSVG/>
                <span>Video</span>
            </Button>
        );
    } else if (type === "screen") {
        return (
            <Button type="button" className="btn" margin="left">
                <ScreenSVG/>
                <span>Screen</span>
            </Button>
        );
    }
    return (<div/>);
}

export default SecondPanelVoiceComponent;
