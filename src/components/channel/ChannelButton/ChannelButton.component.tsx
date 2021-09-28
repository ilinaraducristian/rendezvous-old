import ChannelSVG from "svg/Channel/Channel.svg";
import ButtonComponent from "components/ButtonComponent";
import {ButtonHTMLAttributes, DetailedHTMLProps} from "react";
import {ChannelType} from "dtos/channel.dto";
import styles from "components/channel/ChannelButton/ChannelButton.module.css";

type ComponentProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    channelType: ChannelType,
    channelName: string
}

function ChannelButtonComponent({channelType, channelName, className, ...props}: ComponentProps) {
    return (
        <ButtonComponent className={`${styles.button} ${className ?? ""}`} {...props}>
            <ChannelSVG type={channelType} isPrivate={false}/>
            <span>{channelName}</span>
        </ButtonComponent>
    );
}

export default ChannelButtonComponent;