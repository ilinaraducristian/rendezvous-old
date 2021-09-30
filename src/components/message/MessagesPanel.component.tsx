import {useCallback, useEffect, useRef, useState} from "react";
import MessageComponent from "components/message/Message.component";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {
    addMessages,
    selectChannel as selectChannelAction,
    selectFriendship,
} from "state-management/slices/data/data.slice";
import styled from "styled-components";

import config from "config";
import MessageInputContainerComponent from "components/message/MessageInputContainer/MessageInputContainer.component";
import {
    selectSelectedChannel,
    selectSelectedFriendship,
    selectSelectedFriendshipMessages,
    selectUsers,
} from "state-management/selectors/data.selector";
import {selectSelectedChannelMessages} from "state-management/selectors/channel.selector";
import {Message} from "dtos/message.dto";
import {getMessages} from "socketio/ReactSocketIOProvider";

function MessagesPanelComponent() {

    const messagesList = useRef<HTMLDivElement>(null);
    const channelMessages = useAppSelector(selectSelectedChannelMessages);
    const friendshipMessages = useAppSelector(selectSelectedFriendshipMessages);
    const users = useAppSelector(selectUsers);
    const channel = useAppSelector(selectSelectedChannel);

    const dispatch = useAppDispatch();
    // const [offset, setOffset] = useState(2040);
    const [offset, setOffset] = useState(0);
    const [beginning, setBeginning] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyId, setReplyId] = useState<number | undefined>();
    const friendship = useAppSelector(selectSelectedFriendship)
    const messages = friendship === undefined ? channelMessages : friendshipMessages;

    useEffect(() => {
        messagesList.current?.scroll(0, messagesList.current.scrollHeight);
    }, [messages]);

    const onScroll = useCallback(async () => {
        if (channel === undefined && friendship === undefined) return;
        if (messagesList.current?.scrollTop === 0) {
            if (beginning) return;
            if (config.offline) return;
            const data = await getMessages({
                friendshipId: friendship?.id || null,
                serverId: channel?.serverId || null,
                channelId: channel?.id || null,
                offset: offset
            });
            setOffset(offset + 30);
            if (data.length === 0) {
                setBeginning(true);
                return;
            }
            dispatch(addMessages(data));
            if (friendship !== undefined)
                dispatch(selectFriendship(friendship.id));
            if (channel !== undefined)
                dispatch(selectChannelAction(channel.id));
        }
    }, [dispatch, channel, offset, beginning, friendship]);

    function reply(messageId: number) {
        setReplyId(messageId);
        setIsReplying(true);
    }

    function messageSent() {
        setReplyId(undefined);
        setIsReplying(false);
    }

    return (
        <DivBodyMain>
            <DivBodyMessages ref={messagesList} onScroll={onScroll}>
                <Ol className="list">
                    {
                        messages.map((message: Message) =>
                            <MessageComponent key={`message_${message.id}`}
                                              message={message}
                                              username={users.find(user => user.id === message.userId)?.username || ""}
                                              reply={reply}
                            />
                        ).sort((a, b) => Date.parse(a.props.timestamp) - Date.parse(b.props.timestamp))
                    }
                </Ol>
            </DivBodyMessages>
            {
                !isReplying ||
                <div>replying</div>
            }
            <MessageInputContainerComponent isReplying={isReplying} replyId={replyId} messageSent={messageSent}/>
        </DivBodyMain>
    );

}

/* CSS */

const Ol = styled.ol`
  word-break: break-all;
`;

const DivBodyMain = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const DivBodyMessages = styled.div`
  flex-grow: 1;
  overflow-x: hidden;
`;

/* CSS */

export default MessagesPanelComponent;