import {OverlayTypes, SecondPanelFooterTypes} from "types/UISelectionModes";
import AvatarWithStatusSVG from "svg/AvatarWithStatus/AvatarWithStatus.svg";
import MicrophoneSVG from "svg/Microphone/Microphone.svg";
import HeadphonesSVG from "svg/Headphones/Headphones.svg";
import GearSVG from "svg/Gear/Gear.svg";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectIsMicrophoneMuted, selectSecondPanelFooter} from "state-management/selectors/data.selector";
import {useEffect, useState} from "react";
import {audioContext} from "providers/mediasoup";
import {pauseProducer} from "providers/socketio";
import ButtonComponent from "components/ButtonComponent";
import styles from "components/second-panel/SecondPanelFooter/SecondPanelFooter.module.css";
import {useCallbackDebounced} from "util/debounce";
import {setOverlay} from "state-management/slices/data/data.slice";
import keycloak from "keycloak";

function SecondPanelFooterComponent() {

    const secondPanelFooter = useAppSelector(selectSecondPanelFooter);
    const isMicrophoneMuted = useAppSelector(selectIsMicrophoneMuted);
    const [name, setName] = useState("");
    const dispatch = useAppDispatch();
    const [isDeafen, setIsDeafen] = useState(false);

    useEffect(() => {
        if (!keycloak.authenticated) return;
        setName((keycloak.userInfo as any)?.name ?? "user");
    }, []);

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