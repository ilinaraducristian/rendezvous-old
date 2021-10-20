import {ClipboardEvent, EventHandler, forwardRef, KeyboardEvent, MouseEvent, useCallback} from "react";
import {useAppDispatch} from "state-management/store";
import {setOverlay} from "state-management/slices/data/data.slice";
import {OverlayTypes} from "types/UISelectionModes";
import styles from "./MessageInput.module.css";
import fileToDataUrl from "util/file-to-data-url";

type ComponentProps = {
    onKeyDown: EventHandler<KeyboardEvent<HTMLSpanElement>>,
    onKeyUp: EventHandler<KeyboardEvent<HTMLSpanElement>>,
    onClick: EventHandler<MouseEvent<HTMLSpanElement>>;
}

const MessageInputComponent = forwardRef<HTMLSpanElement, ComponentProps>(({onKeyDown, onKeyUp, onClick}, ref) => {

    const dispatch = useAppDispatch();

    const onCopy = useCallback((event: ClipboardEvent<HTMLSpanElement>) => {
        event.preventDefault();
        const selection = getSelection();
        const clipboard = event.clipboardData;
        if (selection === null || clipboard === null) return;
        clipboard.setData("text/plain", selection.toString());
    }, []);

    const onPaste = useCallback(async (event: ClipboardEvent<HTMLSpanElement>) => {
        event.preventDefault();
        if (!event.clipboardData.types.includes("Files")) {
            document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
            return false;
        }
        let file;
        for (const item of event.clipboardData.items) {
            if (item.kind === "file") {
                file = event.clipboardData.items[0].getAsFile();
                break;
            }
        }
        if (file === undefined || file === null) return false;

        dispatch(setOverlay({
            type: OverlayTypes.ImageInputOverlayComponent,
            payload: {image: await fileToDataUrl(file)},
        }));

    }, [dispatch]);

    return (
        <span
            className={styles.span}
            role="textbox"
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onCopy={onCopy}
            onClick={onClick}
            onPaste={onPaste}
        >
            {/*<EmojiComponent index={3} size={22}/>*/}
            <span contentEditable
                  ref={ref}
            />
        </span>
    );
});

export default MessageInputComponent;