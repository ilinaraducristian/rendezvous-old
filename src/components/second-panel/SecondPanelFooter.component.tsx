import styled from "styled-components";
import {SecondPanelFooterTypes} from "../../types/UISelectionModes";
import AvatarSVG from "../../svg/Avatar.svg";
import MicrophoneSVG from "../../svg/Microphone.svg";
import HeadphonesSVG from "../../svg/Headphones.svg";
import {showSettings} from "../../state-management/slices/data/data.slice";
import GearSVG from "../../svg/Gear.svg";
import {useAppDispatch, useAppSelector} from "../../state-management/store";
import {selectSecondPanelFooter} from "../../state-management/selectors/data.selector";
import {useState} from "react";
import {toggleMute as toggleMuteAction} from "../../state-management/slices/mediasoup.slice";
import {selectIsMuted} from "../../state-management/selectors/mediasoup.selector";

function SecondPanelFooterComponent() {

    const secondPanelFooter = useAppSelector(selectSecondPanelFooter);
    const isMuted = useAppSelector(selectIsMuted)
    // const users = useAppSelector(selectUsers)
    const [username/*, setUsername*/] = useState('');
    const dispatch = useAppDispatch();

    // TODO weird hack to get the username, must be replaced
    // useEffect(() => {
    // (async () => {
    //     let details, error;
    //     do {
    //         try {
    //             error = undefined;
    //             details = await keycloak.getUsername();
    //         } catch (e) {
    //             error = e;
    //         }
    //     } while (error !== undefined || details === undefined);
    //     setUsername(`${details.firstName} ${details.lastName}` || '')
    // })()
    // }, []);

    function toggleMute() {
        dispatch(toggleMuteAction(undefined));
    }

    return (
        <Footer>
            {
                secondPanelFooter !== SecondPanelFooterTypes.generic ||
                <>
                    <AvatarSVG/>
                    <Username> {username} </Username>
                    <Button type="button" className="btn"
                            onClick={toggleMute}
                    >
                        <MicrophoneSVG isMuted={isMuted}/>
                    </Button>
                    <Button type="button" className="btn">
                        <HeadphonesSVG/>
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
  margin: 0 .3em;
`

const Footer = styled.footer`
  color: white;
  background-color: var(--color-13th);
  height: 3.25em;
  min-height: 3.25em;
  display: flex;
  align-items: center;
`
const Username = styled.span`
  color: white;
  flex-grow: 1;
`
export default SecondPanelFooterComponent;