import EndCallSVG from "svg/EndCall/EndCall.svg";
import ScreenSVG from "svg/Screen.svg";
import styles from "components/second-panel/SecondPanelVoice/SecondPanelVoice.module.css";
import ButtonComponent from "components/ButtonComponent";
import {useMediasoup} from "providers/ReactMediasoup.provider";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {
    leaveVoiceChannel as leaveVoiceChannelAction,
    removeChannelUsers,
} from "state-management/slices/data/data.slice";
import {leaveVoiceChannel} from "providers/ReactSocketIO.provider";
import {selectJoinedChannel} from "state-management/selectors/data.selector";

function Button() {
    return (<ButtonComponent className={styles.button}>
        <ScreenSVG/>
        <span>Video</span>
    </ButtonComponent>);
}

function SecondPanelVoiceComponent() {

    const {closeProducer} = useMediasoup();
    const dispatch = useAppDispatch();
    const joinedVoiceChannel = useAppSelector(selectJoinedChannel);

    async function endCall() {
        if (joinedVoiceChannel === null) return;
        const response = await leaveVoiceChannel({
            serverId: joinedVoiceChannel.serverId,
            channelId: joinedVoiceChannel.id,
        });
        dispatch(removeChannelUsers([response]));
        dispatch(leaveVoiceChannelAction(undefined));
        closeProducer();
    }

    return (
        <div className={styles.div}>
            <div className={styles.firstRow}>
                <span className={styles.rtcStatus}>RTC Connecting</span>
                <ButtonComponent className={styles.endCallButton} onClick={endCall}>
                    <EndCallSVG/>
                </ButtonComponent>
            </div>
            <div className={styles.secondRow}>
                <Button/>
                <Button/>
            </div>
        </div>
    );
}

export default SecondPanelVoiceComponent;
