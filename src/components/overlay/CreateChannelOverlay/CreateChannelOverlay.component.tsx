import TransparentBackgroundDivComponent
    from "components/overlay/TransparentBackgroundDiv/TransparentBackgroundDiv.component";
import RadioSVG from "svg/Radio/Radio.svg";
import ChannelSVG from "svg/Channel/Channel.svg";
import {ChannelType, TextChannel} from "dtos/channel.dto";
import ButtonComponent from "components/ButtonComponent";
import XSVG from "svg/XSVG/X.svg";
import styles from "./CreateChannelOverlay.module.css";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import config from "config";
import {createChannel} from "providers/ReactSocketIO.provider";
import {addChannel, selectChannel, setOverlay} from "state-management/slices/data/data.slice";

type ComponentProps = {
    groupId?: number | null,
    groupName?: string
}

function CreateChannelOverlayComponent({groupId = null, groupName}: ComponentProps) {

    const [channelType, setChannelType] = useState(ChannelType.Text);
    const [channelName, setChannelName] = useState("");
    const selectedServer = useAppSelector(selectSelectedServer);
    const dispatch = useAppDispatch();

    async function createChannelCallback() {
        if (config.offline) return;
        if (selectedServer === undefined) return;
        // TODO
        const data = await createChannel({serverId: selectedServer.id, groupId, channelName});
        const channel: TextChannel = {
            id: data?.channelId,
            serverId: selectedServer.id,
            groupId,
            type: ChannelType.Text,
            name: channelName,
            messages: [],
            order: 0,
        };
        dispatch(addChannel(channel));
        dispatch(selectChannel(channel.id));
        dispatch(setOverlay(null));
    }

    function closeOverlay() {
        dispatch(setOverlay(null));
    }

    return (
        <TransparentBackgroundDivComponent>
                <div className={styles.body}>
                    <ButtonComponent className={styles.styledButton} onClick={closeOverlay}>
                        <XSVG/>
                    </ButtonComponent>
                    <header className={styles.header}>
                        <h2 className={styles.h2}>Create {channelType === ChannelType.Voice ? "Voice" : "Text"} Channel</h2>
                        {
                            groupName === undefined ||
                            <h5 className={styles.h5}>in {groupName}</h5>
                        }
                    </header>
                    <span className={styles.channelSpan}>CHANNEL TYPE</span>
                    <ButtonComponent
                        className={`${styles.channelButton} ${channelType === ChannelType.Text ? styles.channelButtonChecked : ""}`}
                        onClick={() => setChannelType(ChannelType.Text)}
                    >
                        <RadioSVG className={styles.styledRadioSvg} checked={channelType === ChannelType.Text}/>
                        <ChannelSVG className={styles.styledChannel1SVG} type={ChannelType.Text} isPrivate={false}/>
                        <h4 className={styles.textChannelH4}>Text Channel</h4>
                        <h5 className={styles.textChannelH5}>Post images, GIFs, stickers, opinions and puns</h5>
                    </ButtonComponent>
                    <ButtonComponent
                        className={`${styles.channelButton} ${channelType === ChannelType.Voice ? styles.channelButtonChecked : ""}`}
                        onClick={() => setChannelType(ChannelType.Voice)}
                    >
                        <RadioSVG className={styles.styledRadioSvg} checked={channelType === ChannelType.Voice}/>
                        <ChannelSVG className={styles.styledChannel1SVG} type={ChannelType.Voice} isPrivate={false}/>
                        <h4 className={styles.textChannelH4}>Voice Channel</h4>
                        <h5 className={styles.textChannelH5}>Hang out with voice, video and screen sharing</h5>
                    </ButtonComponent>
                    <span className={styles.channelSpan}>CHANNEL NAME</span>
                    <div className={styles.inputContainer}>
                        <ChannelSVG className={styles.styledChannel2SVG} type={channelType} isPrivate={false}/>
                        <input className={styles.input} placeholder="new-channel"
                               onChange={event => setChannelName(event.target.value)}/>
                    </div>
                </div>
                <footer className={styles.footer}>
                    <ButtonComponent className={styles.cancelButton}>
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent
                        disabled={channelName.trim().length === 0}
                        className={`${styles.createButton} ${channelName.trim().length === 0 ? styles.createButtonDisabled : ""}`}
                        onClick={createChannelCallback}
                    >
                        Create Channel
                    </ButtonComponent>
                </footer>
        </TransparentBackgroundDivComponent>
    );
}

export default CreateChannelOverlayComponent;