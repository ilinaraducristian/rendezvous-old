import styled from "styled-components";
import {SecondPanelFooterTypes} from "types/UISelectionModes";
import AvatarWithStatusSVG from "svg/AvatarWithStatus/AvatarWithStatus.svg";
import MicrophoneSVG from "svg/Microphone/Microphone.svg";
import HeadphonesSVG from "svg/Headphones/Headphones.svg";
import {showSettings} from "state-management/slices/data/data.slice";
import GearSVG from "svg/Gear/Gear.svg";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSecondPanelFooter} from "state-management/selectors/data.selector";
import {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {useMediasoup} from "mediasoup/ReactMediasoupProvider";
import {pauseProducer} from "socketio/ReactSocketIOProvider";

function SecondPanelFooterComponent() {

    const secondPanelFooter = useAppSelector(selectSecondPanelFooter);
    const {isMuted} = useMediasoup();
    const [name, setName] = useState("");
    const dispatch = useAppDispatch();
    const {keycloak, initialized} = useKeycloak();

    useEffect(() => {
        if (!initialized || !keycloak.authenticated) return;
        setName((keycloak.userInfo as any).name);
    }, [keycloak, initialized]);

    async function toggleMute() {
        await pauseProducer();
        // dispatch(toggleMuteAction(undefined));
    }

    return (
        <Footer>
            {
                secondPanelFooter !== SecondPanelFooterTypes.generic ||
                <>
                    <AvatarWithStatusSVG/>
                    <Username> {name} </Username>
                    <Button type="button" className="btn"
                            onClick={toggleMute}
                    >
                        <MicrophoneSVG isMuted={isMuted}/>
                    </Button>
                    <Button type="button" className="btn">
                        <HeadphonesSVG isMuted={false}/>
                    </Button>
                    <Button type="button" className="btn"
                            onClick={() => dispatch(showSettings(undefined))}
                    >
                        <GearSVG/>
                    </Button>
                </>
            }
        </Footer>
    )
}

const Button = styled.button`
  margin: 0 4px;
`

const Footer = styled.footer`
  color: white;
  background-color: var(--color-13th);
  height: 52px;
  min-height: 52px;
  display: flex;
  align-items: center;
`
const Username = styled.span`
  color: white;
  flex-grow: 1;
`
export default SecondPanelFooterComponent;