import PlusSVG from "svg/Plus.svg";
import GIFSVG from "svg/GIF.svg";
import {KeyboardEvent, useCallback, useEffect, useRef, useState} from "react";
import {emojis} from "util/trie";
import {addMessages} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {
    selectSelectedChannel,
    selectSelectedFriendship,
    selectSelectedServer,
    selectUsers
} from "state-management/selectors/data.selector";
import PopupContainerComponent, {PopupContainerRefType} from "components/message/PopupContainer/PopupContainer.component";
import {stringSimilarity} from "string-similarity-js";
import {NewMessageRequest} from "dtos/message.dto";
import {sendMessage} from "providers/socketio";
import styles from "components/message/MessageInputContainer/MessageInputContainer.module.css";
import ButtonComponent from "components/ButtonComponent";
import MessageInputComponent from "components/message/MessageInput/MessageInput.component";
import {useKeycloak} from "@react-keycloak/web";
import checkPermission from "../../../util/check-permission";

type ComponentProps = {
    isReplying: boolean,
    replyId?: number,
    messageSent: any,
}

enum PopupType {
    commands,
    emojisAndMentions
}

function MessageInputContainerComponent({isReplying, replyId, messageSent}: ComponentProps) {

    const popupRef = useRef<PopupContainerRefType>(null);
    const inputRef = useRef<HTMLSpanElement>(null);
    const selectedChannel = useAppSelector(selectSelectedChannel);
    const selectedFriendship = useAppSelector(selectSelectedFriendship);

    const dispatch = useAppDispatch();
    const [cursorPosition, setCursorPosition] = useState(0);

    const [popupType, setPopupType] = useState<PopupType | null>(null);
    const [popupList, setPopupList] = useState<any[]>([]);
    const users = useAppSelector(selectUsers);
    const {initialized, keycloak} = useKeycloak();
    const selectedServer = useAppSelector(selectSelectedServer);

    const sendMessageCallback = useCallback(async (event: KeyboardEvent<HTMLSpanElement>) => {
        event.preventDefault();
        if (selectedChannel === undefined && selectedFriendship === undefined) return;
        let message = event.currentTarget.innerText;
        (event.target as any).innerText = "";
        let payload: NewMessageRequest = {
            friendshipId: selectedFriendship?.id ?? null,
            channelId: selectedChannel?.id ?? null,
            serverId: selectedChannel?.serverId ?? null,
            text: message,
            isReply: false,
            replyId: null,
            image: null,
        };
        if (isReplying) {
            if (replyId === undefined) return;
            payload.isReply = true;
            payload.replyId = replyId;
        }
        const dataMessage = await sendMessage(payload);
        messageSent();
        dispatch(addMessages([dataMessage]));
    }, [messageSent, dispatch, isReplying, replyId, selectedChannel, selectedFriendship]);

    const replaceTextWithEmoji = useCallback((emojiId: number) => {
        const selection = getSelection();
        if (inputRef.current === null || popupRef.current === null || selection === null || selection.anchorNode === null) return;
        const emoji = emojis[emojiId];
        const textUntilCursor = inputRef.current.innerText.substring(0, cursorPosition);
        const lastIndexOfColon = textUntilCursor.lastIndexOf(":");
        if (lastIndexOfColon === -1) return;
        const textBeforeColon = inputRef.current.innerText.substring(0, lastIndexOfColon);
        const textAfterEmoji = inputRef.current.innerText.substring(cursorPosition + 1);
        inputRef.current.innerText = textBeforeColon + emoji.emoji + textAfterEmoji;
        const textNode = selection.anchorNode.childNodes[0];
        selection.setPosition(textNode, lastIndexOfColon + 2);
        setPopupList([]);
        setPopupType(null);
        return false;
    }, [cursorPosition]);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLSpanElement>) => {

        if (event.key.includes("Enter")) {
            if (checkPermission(initialized, keycloak, selectedServer, 'writeMessages') === undefined) {
                event.preventDefault();
                return;
            }
            if (popupType === null) {
                sendMessageCallback(event).then();
                return;
            }
            if (popupRef.current === null) return;
            if (popupType === PopupType.emojisAndMentions) {
                event.preventDefault();
                replaceTextWithEmoji(popupRef.current.getSelectedElement().props.emojiId);
            }
            return;
        } else if (["ArrowUp", "ArrowDown"].includes(event.key)) {
            if (popupType === null || popupRef.current === null) return;
            event.preventDefault();
            popupRef.current.move(event.key === "ArrowUp");
        }
    }, [popupType, sendMessageCallback, replaceTextWithEmoji, keycloak, selectedServer, initialized]);

    const displayMentions = useCallback((matchedString: string) => {
        if (selectedServer === undefined) return;
        const usersToDisplay = selectedServer.members
            .map(member => users.find(user => user.id === member.userId))
            .map((user) => ({
                ...user,
                score: stringSimilarity(`${user?.firstName} + ${user?.lastName}`, matchedString),
            }))
            .filter(({score}) => score > 0.15)
            .sort((a, b) => b.score - a.score)
            .map((user, index) => (
                <div className={styles.userContainerDiv} key={`popup_user_${index}`}>
                    <span>{user.firstName}</span>
                    <span>{user.lastName}</span>
                </div>
            ));
        if (usersToDisplay.length) return setPopupType(null);
        setPopupList(usersToDisplay);
        setPopupType(PopupType.emojisAndMentions);
    }, [selectedServer, users]);

    const checkShouldDisplayCommandPallet = useCallback((text: string): boolean => {
        const forwardSlashRegexMatches = text.match(/\//g);
        if (forwardSlashRegexMatches === null || forwardSlashRegexMatches.length > 1) return false;
        return false;
    }, []);

    const checkShouldDisplayPopupBasedOnChar = useCallback((text: string, char: string) => {
        const selection = getSelection();
        if (selection === null) return;
        const textUntilCursor = text.substring(0, cursorPosition);
        const lastIndexOfChar = textUntilCursor.lastIndexOf(char);
        if (lastIndexOfChar === -1) return;
        const charBeforeChar = textUntilCursor[lastIndexOfChar - 1];
        if (charBeforeChar !== undefined && charBeforeChar !== " ") return;
        const textFromCharToCursor = textUntilCursor.substring(lastIndexOfChar + 1);
        if (textFromCharToCursor.length < 2) return;
        const match = textFromCharToCursor.match(/^[a-z0-9_]+$/);
        if (match === null) return;
        return match[0];
    }, [cursorPosition]);

    const displayCommandPallet = useCallback(() => {
        setPopupType(PopupType.commands);
    }, []);

    const displayEmojisList = useCallback((matchedString: string) => {
        const emojisToDisplay = emojis.map(emoji => ({
            ...emoji,
            score: stringSimilarity(emoji.shortcut, matchedString),
        }))
            .filter(({score}) => score > 0.15)
            .sort((a, b) => b.score - a.score)
            .map((emoji, index) => (
                <div className={styles.emojiContainerDiv} key={`emoji_${index}`}>
                    <div>{emoji.emoji}</div>
                    <div>{emoji.shortcut}</div>
                </div>
            ));
        if (emojisToDisplay.length === 0) return setPopupType(null);
        setPopupList(emojisToDisplay);
        setPopupType(PopupType.emojisAndMentions);
    }, []);

    useEffect(() => {
        if (inputRef.current === null) return;
        const text = inputRef.current.innerText;
        if (text.length === 0) {
            setPopupType(null);
            return;
        }
        const shouldDisplayCommandPallet = checkShouldDisplayCommandPallet(text);
        if (shouldDisplayCommandPallet) return displayCommandPallet();
        let matchedString = checkShouldDisplayPopupBasedOnChar(text, ":");
        if (matchedString !== undefined) return displayEmojisList(matchedString);
        matchedString = checkShouldDisplayPopupBasedOnChar(text, "@");
        if (matchedString !== undefined) return displayMentions(matchedString);
        setPopupType(null);
    }, [
        displayEmojisList,
        displayCommandPallet,
        displayMentions,
        cursorPosition,
        checkShouldDisplayCommandPallet,
        checkShouldDisplayPopupBasedOnChar,
    ]);

    const updateCursorPosition = useCallback(() => {
        const selection = getSelection();
        if (selection !== null) {
            setCursorPosition(selection.anchorOffset);
        }
    }, []);

    // function selectEmoji(index: number) {
    //
    // }

    return <>
        {popupType !== PopupType.emojisAndMentions ||
        <PopupContainerComponent
            ref={popupRef}
            selectElement={element => {
                replaceTextWithEmoji(element.props.emojiId);
            }}
            title={"EMOJI MATCHING"}
            elements={popupList}
        />}
        <footer className={styles.footer}>
            <ButtonComponent className="btn--off btn--hover btn__icon">
                <PlusSVG/>
            </ButtonComponent>
            <MessageInputComponent
                ref={inputRef}
                onKeyDown={onKeyDown}
                onKeyUp={updateCursorPosition}
                onClick={updateCursorPosition}
            />
            <ButtonComponent className="btn--off btn--hover btn__icon">
                <GIFSVG/>
            </ButtonComponent>
            <ButtonComponent className="btn__icon">
                <div className={styles.divEmoji} style={{backgroundImage: "url(emojis_subset.png)"}}/>
            </ButtonComponent>
            {/*<EmojiPickerComponent selectEmoji={selectEmoji}/>*/}
        </footer>
    </>;

}

export default MessageInputContainerComponent;