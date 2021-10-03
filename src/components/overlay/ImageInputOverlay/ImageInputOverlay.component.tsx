import {useCallback} from "react";
import {addMessages, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedChannel} from "state-management/selectors/data.selector";
import {NewMessageRequest} from "dtos/message.dto";
import {sendMessage} from "socketio/ReactSocketIOProvider";
import styles from "./ImageInputOverlay.module.css";
import ButtonComponent from "components/ButtonComponent";

type ComponentProps = {
    image: string
}

function ImageInputOverlayComponent({image}: ComponentProps) {

    const selectedChannel = useAppSelector(selectSelectedChannel);

    const dispatch = useAppDispatch();

    const onClick = useCallback(async () => {
        if (selectedChannel === undefined) return;
        let payload: NewMessageRequest = {
            friendshipId: null,
            channelId: selectedChannel.id,
            text: "",
            isReply: false,
            replyId: null,
            image,
        };
        const message = await sendMessage(payload);
        dispatch(addMessages([message]));
        dispatch(setOverlay(null));
    }, [image, selectedChannel, dispatch]);

    return (
        <div className={styles.transparentBackground}>
            <div className={styles.overlayDiv}>
                <div className={styles.mainDiv}>
                    <img className={styles.img} src={image} alt=" "/>
                    <span className={`${styles.span} ${styles.filenameSpan}`}>unknown.png</span>
                    <span className={`${styles.span} ${styles.uploadSpan}`}>Upload to</span>
                    <span className={styles.span}>ADD A COMMENT <span className={styles.optionalSpan}>(OPTIONAL)</span></span>
                    <input className={styles.input}/>
                </div>
                <footer className={styles.footer}>
                    <ButtonComponent className={styles.button} onClick={onClick}>Upload</ButtonComponent>
                </footer>
            </div>
        </div>
    );

}

export default ImageInputOverlayComponent;
