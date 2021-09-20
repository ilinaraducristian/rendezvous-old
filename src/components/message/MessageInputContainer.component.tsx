import PlusSVG from "svg/Plus.svg";
import MessageInputComponent from "components/message/MessageInput.component";
import GIFSVG from "svg/GIF.svg";
import styled from "styled-components";
import {KeyboardEvent, useCallback, useEffect, useRef, useState} from "react";
import {emojis} from "util/trie";
import {addMessages} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedChannel, selectSelectedFriendship, selectUsers} from "state-management/selectors/data.selector";
import {useLazySendMessageQuery} from "../../state-management/apis/socketio.api";
import PopupContainerComponent, {PopupContainerRefType} from "./PopupContainer.component";
import {stringSimilarity} from "string-similarity-js";
import {selectSelectedServerMembers} from "../../state-management/selectors/server.selector";
import {NewMessageRequest} from "../../dtos/message.dto";

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
    const [fetchSendMessage, {data: dataMessage, isSuccess: isSuccessSendMessage}] = useLazySendMessageQuery()
    const dispatch = useAppDispatch();
    const [cursorPosition, setCursorPosition] = useState(0);

    const [popupType, setPopupType] = useState<PopupType | null>(null);
    const [popupList, setPopupList] = useState<any[]>([]);
    const members = useAppSelector(selectSelectedServerMembers);
    const users = useAppSelector(selectUsers);

    const sendMessage = useCallback(async (event: any) => {
        event.preventDefault();
        if (selectedChannel === undefined && selectedFriendship === undefined) return;
        let message = (event.target as any).innerText;
        (event.target as any).innerText = "";
        let payload: NewMessageRequest = {
            friendshipId: selectedFriendship?.id || null,
            channelId: selectedChannel?.id || null,
            text: message,
            isReply: false,
            replyId: null,
            image: null
        };
        if (isReplying) {
            if (replyId === undefined) return;
            payload.isReply = true;
            payload.replyId = replyId;
        }
        fetchSendMessage(payload);
    }, [isReplying, replyId, selectedChannel, fetchSendMessage, selectedFriendship])

    useEffect(() => {
        if (!isSuccessSendMessage || dataMessage === undefined) return;
        messageSent();
        dispatch(addMessages([dataMessage]));
    }, [isSuccessSendMessage, dataMessage, messageSent, dispatch])

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
            if (popupType === null) {
                sendMessage(event).then()
                return;
            }
            if (popupRef.current === null) return;
            if (popupType === PopupType.emojisAndMentions) {
                event.preventDefault();
                replaceTextWithEmoji(popupRef.current.getSelectedElement().props.emojiId);
            }
            return;
        } else if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            if (popupType === null || popupRef.current === null) return;
            event.preventDefault();
            popupRef.current.move(event.key === 'ArrowUp');
        }
    }, [popupType, sendMessage, replaceTextWithEmoji])

    const displayMentions = useCallback((matchedString: string) => {
        const usersToDisplay = members
            .map(member => users.find(user => user.id === member.userId))
            .map((user) => ({
                ...user,
                score: stringSimilarity(`${user?.firstName} + ${user?.lastName}`, matchedString)
            }))
            .filter(({score}) => score > 0.15)
            .sort((a, b) => b.score - a.score)
            .map((user, index) => (
                <UserContainerDiv key={`popup_user_${index}`} userId={user.id}>
                    <span>{user.firstName}</span>
                    <span>{user.lastName}</span>
                </UserContainerDiv>
            ));
        if (usersToDisplay.length) return setPopupType(null);
        setPopupList(usersToDisplay)
        setPopupType(PopupType.emojisAndMentions)
    }, [members, users]);

    const checkShouldDisplayCommandPallet = useCallback((text: string): boolean => {
        const forwardSlashRegexMatches = text.match(/\//g);
        if (forwardSlashRegexMatches === null || forwardSlashRegexMatches.length > 1) return false;
        return false
    }, []);

    const checkShouldDisplayPopupBasedOnChar = useCallback((text: string, char: string) => {
        const selection = getSelection();
        if (selection === null) return;
        const textUntilCursor = text.substring(0, cursorPosition);
        const lastIndexOfChar = textUntilCursor.lastIndexOf(char);
        if (lastIndexOfChar === -1) return;
        const charBeforeChar = textUntilCursor[lastIndexOfChar - 1];
        if (charBeforeChar !== undefined && charBeforeChar !== ' ') return;
        const textFromCharToCursor = textUntilCursor.substring(lastIndexOfChar + 1);
        if (textFromCharToCursor.length < 2) return;
        const match = textFromCharToCursor.match(/^[a-z0-9_]+$/);
        if (match === null) return;
        return match[0];
    }, [cursorPosition]);

    const displayCommandPallet = useCallback(() => {
        setPopupType(PopupType.commands)
    }, []);

    const displayEmojisList = useCallback((matchedString: string) => {
        const emojisToDisplay = emojis.map(emoji => ({
            ...emoji,
            score: stringSimilarity(emoji.shortcut, matchedString)
        }))
            .filter(({score}) => score > 0.15)
            .sort((a, b) => b.score - a.score)
            .map((emoji, index) => (
                <EmojiContainerDiv key={`emoji_${index}`} emojiId={emoji.id}>
                    <div>{emoji.emoji}</div>
                    <div>{emoji.shortcut}</div>
                </EmojiContainerDiv>
            ));
        if (emojisToDisplay.length === 0) return setPopupType(null);
        setPopupList(emojisToDisplay)
        setPopupType(PopupType.emojisAndMentions)
    }, []);

    useEffect(() => {
        if (inputRef.current === null) return;
        const text = inputRef.current.innerText;
        if (text.length === 0) {
            setPopupType(null)
            return;
        }
        const shouldDisplayCommandPallet = checkShouldDisplayCommandPallet(text);
        if (shouldDisplayCommandPallet) return displayCommandPallet();
        let matchedString = checkShouldDisplayPopupBasedOnChar(text, ':');
        if (matchedString !== undefined) return displayEmojisList(matchedString);
        matchedString = checkShouldDisplayPopupBasedOnChar(text, '@');
        if (matchedString !== undefined) return displayMentions(matchedString);
        setPopupType(null)
    }, [
        displayEmojisList,
        displayCommandPallet,
        displayMentions,
        cursorPosition,
        checkShouldDisplayCommandPallet,
        checkShouldDisplayPopupBasedOnChar
    ])

    const updateCursorPosition = useCallback(() => {
        const selection = getSelection();
        if (selection !== null) {
            setCursorPosition(selection.anchorOffset)
        }
    }, []);

    return <>
        {popupType !== PopupType.emojisAndMentions ||
        <PopupContainerComponent
            ref={popupRef}
            selectElement={element => {
                replaceTextWithEmoji(element.props.emojiId);
            }}
            title={'EMOJI MATCHING'}
            elements={popupList}
        />}
        <Footer>
            <button type="button" className="btn btn--off btn--hover btn__icon">
                <PlusSVG/>
            </button>
            <MessageInputComponent
                ref={inputRef}
                onKeyDown={onKeyDown}
                onKeyUp={updateCursorPosition}
                onClick={updateCursorPosition}
            />
            <button type="button" className="btn btn--off btn--hover btn__icon">
                <GIFSVG/>
            </button>
            <button type="button" className="btn btn__icon">
                <DivEmoji/>
            </button>
        </Footer>
    </>;

}

/* CSS */

const EmojiContainerDiv = styled.div<{ emojiId: number }>`
  display: flex;
  justify-content: space-between;
`;

const UserContainerDiv = styled.div<{ userId: string }>`
  display: flex;
  gap: 0.5rem
`;

const Footer = styled.footer`
  background-color: var(--color-5th);
  border-radius: 0.5em;
  max-height: 12.5em;
  margin: 0 1em 1.5em 1em;
  display: flex;
  align-items: flex-start;
`;

const DivEmoji = styled.div`
  background-image: url("../../assets/emojis.png");
  background-position: 0 0;
  background-size: 242px 110px;
  background-repeat: no-repeat;
  width: 22px;
  height: 22px;
  transform: scale(1);
  filter: grayscale(100%);

  &:hover {
    transform: scale(1.14);
    filter: grayscale(0%);
  }
`;

/* CSS */

export default MessageInputContainerComponent;