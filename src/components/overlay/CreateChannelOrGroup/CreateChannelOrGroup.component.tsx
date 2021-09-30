import TransparentBackgroundDiv from "components/overlay/TransparentBackgroundDiv";
import {useState} from "react";
import RadioSVG from "svg/Radio/Radio.svg";
import ChannelSVG from "svg/Channel/Channel.svg";
import {ChannelType} from "dtos/channel.dto";
import ButtonComponent from "components/ButtonComponent";
import XSVG from "svg/XSVG/X.svg";
import styles from "components/overlay/CreateChannelOrGroup/CreateChannelOrGroup.module.css";

function CreateChannelOrGroupComponent() {

    const [channelType, setChannelType] = useState(ChannelType.Text);
    const [channelName, setChannelName] = useState("");

    return (
        <TransparentBackgroundDiv>
            <div>
                <div className={styles.body}>
                    <ButtonComponent className={styles.styledButton}>
                        <XSVG/>
                    </ButtonComponent>
                    <h2 className={styles.h2}>Create {channelType === ChannelType.Voice ? "Voice" : "Text"} Channel</h2>
                    <h5 className={styles.h5}>in Text Channels</h5>
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
                    >
                        Create Channel
                    </ButtonComponent>
                </footer>
            </div>
        </TransparentBackgroundDiv>
    );
}

/* CSS */

export default CreateChannelOrGroupComponent;