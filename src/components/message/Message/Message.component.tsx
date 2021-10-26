import {useEffect, useRef, useState} from "react";
import {useAppDispatch} from "state-management/store";
import {
    deleteMessage as deleteMessageAction,
    editMessage as editMessageAction,
} from "state-management/slices/data/data.slice";

import config from "config";
import {Message} from "dtos/message.dto";
import {deleteMessage, editMessage} from "providers/socketio";
import styles from "./Message.module.css";
import ButtonComponent from "components/ButtonComponent";
import PencilSVG from "svg/Pencil/Pencil.svg";
import Arrow2SVG from "svg/Arrow2/Arrow2.svg";
import TrashcanSVG from "svg/Trashcan/Trashcan.svg";

type ComponentProps = {
    message: Message,
    username: string,
    reply: any,
}

function MessageComponent(
    {
        message: {
            id: messageId,
            serverId,
            channelId,
            timestamp,
            text,
            isReply,
            replyId,
            image,
        },
        username,
        reply,
    }: ComponentProps) {

    const time = new Date(timestamp);
    const [actions, setActions] = useState(false);
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const textRef = useRef<HTMLSpanElement>(null);
    const [oldMessage, setOldMessage] = useState("");
    const [gifs, setGifs] = useState<string[]>([]);

    useEffect(() => {
        const found = text.match(/https:\/\/media.tenor.com\/videos\/[0-9a-zA-Z]{32}\/mp4/g);
        if (found === null) return;
        setGifs(found);
    }, [text]);

    function onMouseEnter() {
        setActions(true);
    }

    function onMouseLeave() {
        setActions(false);
    }

    function editMode() {
        if (isEditing) {
            if (textRef.current === null) return;
            textRef.current.innerText = oldMessage;
            setIsEditing(false);
        } else {
            if (textRef.current === null) return;
            setOldMessage(textRef.current.innerText);
            setIsEditing(true);
        }
    }

    async function editMessageCallback() {
        if (!config.offline) {
            await editMessage({
                serverId: serverId || 0,
                channelId: channelId || 0,
                messageId,
                text: textRef.current?.innerText || "",
            });
            dispatch(editMessageAction({serverId, channelId, messageId, text: textRef.current?.innerText}));
            setIsEditing(false);
        }
    }

    async function deleteMessageCallback() {
        if (!config.offline) {
            await deleteMessage({serverId: serverId || 0, channelId: channelId || 0, messageId});
            dispatch(deleteMessageAction({serverId, channelId, messageId}));
        } else {
            dispatch(deleteMessageAction({serverId, channelId, messageId}));
        }
    }

    return (
        <div className={styles.divContainer} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {
                !isReply ||
                <div>{
                    replyId === null ?
                        "message has been deleted"
                        :
                        `replied to ${replyId}`
                }</div>
            }
            <div className={styles.div}>
                {!actions ||
                <div className={styles.modifierContainer}>
                    <ButtonComponent onClick={editMode}><PencilSVG/></ButtonComponent>
                    <ButtonComponent onClick={() => reply(messageId)}><Arrow2SVG/></ButtonComponent>
                    <ButtonComponent onClick={deleteMessageCallback}><TrashcanSVG/></ButtonComponent>
                </div>
                }
                <time className={styles.time} dateTime={time.toISOString()}>
                    {time.getHours()} : {time.getMinutes()}
                </time>
                <span className={styles.spanUsername}>{username}</span>
                <div className={styles.divMessageContainer}>
                    <span className={styles.spanMessage} suppressContentEditableWarning contentEditable={isEditing}
                          ref={textRef}>{text}</span>
                    {
                        !isEditing ||
                        <ButtonComponent onClick={editMessageCallback}>Save</ButtonComponent>
                    }
                    {
                        image === null ||
                        <img className={styles.img} src={image} alt="user uploaded content"/>
                    }
                    {
                        gifs.map((url, i) =>
                            <video
                                className={styles.video}
                                key={`video_${i}`}
                                src={url}
                                loop={true}
                                onMouseEnter={event => {
                                    (event.target as HTMLVideoElement).play().then();
                                }}
                                onMouseLeave={event => {
                                    (event.target as HTMLVideoElement).pause();
                                }}
                            />,
                        )
                    }
                </div>
            </div>
        </div>
    );

}

export default MessageComponent;
