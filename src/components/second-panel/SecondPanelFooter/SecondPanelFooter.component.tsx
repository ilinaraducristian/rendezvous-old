import {OverlayTypes, SecondPanelFooterTypes} from "types/UISelectionModes";
import AvatarWithStatusSVG from "svg/AvatarWithStatus/AvatarWithStatus.svg";
import MicrophoneSVG from "svg/Microphone/Microphone.svg";
import HeadphonesSVG from "svg/Headphones/Headphones.svg";
import GearSVG from "svg/Gear/Gear.svg";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSecondPanelFooter} from "state-management/selectors/data.selector";
import {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {useMediasoup} from "providers/ReactMediasoup.provider";
import {pauseProducer} from "providers/ReactSocketIO.provider";
import ButtonComponent from "components/ButtonComponent";
import styles from "components/second-panel/SecondPanelFooter/SecondPanelFooter.module.css";
import {useCallbackDebounced} from "util/debounce";
import {setOverlay} from "state-management/slices/data/data.slice";

function SecondPanelFooterComponent() {

    const secondPanelFooter = useAppSelector(selectSecondPanelFooter);
    const {isMuted: isMicrophoneMuted, audioContext} = useMediasoup();
    const [name, setName] = useState("");
    const dispatch = useAppDispatch();
    const {keycloak, initialized} = useKeycloak();
    const [isDeafen, setIsDeafen] = useState(false);

    useEffect(() => {
        if (!initialized || !keycloak.authenticated) return;
        setName((keycloak.userInfo as any)?.name ?? "user");
    }, [keycloak, initialized]);

    const toggleMute = useCallbackDebounced(pauseProducer, []);

    const toggleDeafen = useCallbackDebounced(async () => {
        if (audioContext === undefined) return;
        if (audioContext.state === "running") {
            await audioContext.suspend();
            setIsDeafen(true);
        } else if (audioContext.state === "suspended") {
            await audioContext.resume();
            setIsDeafen(false);
        }
    }, []);

    return (
        <footer className={styles.footer}>
            {
                secondPanelFooter !== SecondPanelFooterTypes.generic ||
                <>
                    <AvatarWithStatusSVG/>
                    <span className={styles.span}> {name} </span>
                    <ButtonComponent className={styles.button} onClick={toggleMute}
                    >
                        <MicrophoneSVG isMuted={isMicrophoneMuted}/>
                    </ButtonComponent>
                    <ButtonComponent className={styles.button} onClick={toggleDeafen}>
                        <HeadphonesSVG isMuted={isDeafen}/>
                    </ButtonComponent>
                    <ButtonComponent className={styles.button}
                                     onClick={() => dispatch(setOverlay({type: OverlayTypes.UserSettingsComponent}))}
                    >
                        <GearSVG/>
                    </ButtonComponent>
                </>
            }
        </footer>
    );
}

export default SecondPanelFooterComponent;