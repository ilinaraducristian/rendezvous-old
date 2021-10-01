import config from "config";
import {io as socketio_io, Socket as socketio_Socket} from "socket.io-client";
import {DefaultEventsMap, EventNames, EventParams} from "socket.io-client/build/typed-events";
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {
    JoinVoiceChannelRequest,
    JoinVoiceChannelResponse,
    MoveChannelRequest,
    MoveChannelResponse,
    NewChannelRequest,
    NewChannelResponse,
} from "dtos/channel.dto";
import {NewGroupRequest, NewGroupResponse} from "dtos/group.dto";
import {
    DeleteMessagesRequest,
    EditMessagesRequest,
    GetMessagesRequest,
    Message,
    NewMessageRequest,
} from "dtos/message.dto";
import {
    JoinServerRequest,
    JoinServerResponse,
    NewInvitationRequest,
    NewServerRequest,
    NewServerResponse,
} from "dtos/server.dto";
import {AcceptFriendRequest, SendFriendRequest, SendFriendRequestResponse, UserDataResponse} from "dtos/user.dto";
import {useAppDispatch} from "state-management/store";
import {notificationSound} from "mediasoup/ReactMediasoupProvider";
import {
    addChannel,
    addChannelUsers,
    addFriendRequest,
    addGroup,
    addMember,
    addMessages,
    deleteMessage as deleteMessageAction,
    deleteServer as deleteServerAction,
    editMessage as editMessageAction,
} from "state-management/slices/data/data.slice";

function emitAck<Ev extends EventNames<DefaultEventsMap>>(ev: Ev, ...args: EventParams<DefaultEventsMap, Ev>): Promise<any> {
    return new Promise(resolve => {
        if (args.length === 0)
            return socket.emit(ev, 0, resolve);
        socket.emit(ev, ...args, resolve);
    });
}

class Socket extends socketio_Socket {
    auth: { token?: string } = {};
    emitAck = emitAck;
}

const socket: Socket = socketio_io(config.socketIoUrl, {
    autoConnect: false,
    transports: ["websocket"],
    path: config.production ? "/api/socket.io" : undefined,
}) as Socket;

Object.assign(socket, {emitAck, auth: {}});

type InitialObjectProperties = {
    socket: Socket,
    connected: boolean,
};

const initialObject: InitialObjectProperties = {
    socket,
    connected: false,
};

const SocketIOContext = createContext(initialObject);

function ReactSocketIOProvider({children}: { children: PropsWithChildren<any> }) {

    const [state, setState] = useState(initialObject);
    const dispatch = useAppDispatch();

    useEffect(() => {
        initialObject.socket.on("connect", () => {
            initialObject.connected = true;
            setState({...initialObject});
        });

        initialObject.socket.on("disconnect", () => {
            initialObject.connected = false;
            setState({...initialObject});
        });

        initialObject.socket.on("new_message", (payload) => {
            dispatch(addMessages([payload]));
            if (document.hidden) {
                notificationSound.currentTime = 0;
                notificationSound.play();
            }
        });

        initialObject.socket.on("new_member", (payload) => {
            dispatch(addMember(payload));
        });

        initialObject.socket.on("new_channel", (payload) => {
            dispatch(addChannel(payload));
        });

        initialObject.socket.on("new_group", (payload) => {
            dispatch(addGroup(payload));
        });

        initialObject.socket.on("user_joined_voice-channel", (payload) => {
            dispatch(addChannelUsers([payload]));
        });

        initialObject.socket.on("message_edited", (payload) => {
            dispatch(editMessageAction(payload));
        });

        initialObject.socket.on("message_deleted", (payload) => {
            dispatch(deleteMessageAction(payload));
        });

        initialObject.socket.on("new_friend_request", (payload) => {
            dispatch(addFriendRequest(payload));
        });

        initialObject.socket.on("friend_request_accepted", () => {
            // dispatch(add)
        });

        initialObject.socket.on("server_deleted", (payload) => {
            dispatch(deleteServerAction(payload));
        });

        setState({...initialObject});
    }, []);

    return (
        <SocketIOContext.Provider value={state}>
            {children}
        </SocketIOContext.Provider>
    );
}

export const useSocket = () => useContext(SocketIOContext);

export function joinVoiceChannel(data: JoinVoiceChannelRequest): Promise<JoinVoiceChannelResponse> {
    return socket.emitAck("join_voice_channel", data);
}

export function createChannel(data: NewChannelRequest): Promise<NewChannelResponse> {
    return socket.emitAck("create_channel", data);
}

export function moveChannel(data: MoveChannelRequest): Promise<MoveChannelResponse> {
    return socket.emitAck("move_channel", data);
}

export function createGroup(data: NewGroupRequest): Promise<NewGroupResponse> {
    return socket.emitAck("create_group", data);
}

export function sendMessage(data: NewMessageRequest): Promise<Message> {
    return socket.emitAck("send_message", data);
}

export function getMessages(data: GetMessagesRequest): Promise<Message[]> {
    return socket.emitAck("get_messages", data);
}

export function editMessage(data: EditMessagesRequest): Promise<string> {
    return socket.emitAck("edit_message", data);
}

export function deleteMessage(data: DeleteMessagesRequest): Promise<string> {
    return socket.emitAck("delete_message", data);
}

export function createServer(data: NewServerRequest): Promise<NewServerResponse> {
    return socket.emitAck("create_server", data);
}

export function createInvitation(data: NewInvitationRequest): Promise<string> {
    return socket.emitAck("create_invitation", data);
}

export function joinServer(data: JoinServerRequest): Promise<JoinServerResponse> {
    return socket.emitAck("join_server", data);
}

export function sendFriendRequest(data: SendFriendRequest): Promise<SendFriendRequestResponse> {
    return socket.emitAck("send_friend_request", data);
}

export function getUserData(): Promise<UserDataResponse> {
    return socket.emitAck("get_user_data");
}

export function acceptFriendRequest(data: AcceptFriendRequest): Promise<any> {
    return socket.emitAck("accept_friend_request", data);
}

export function rejectFriendRequest(data: any): Promise<any> {
    return socket.emitAck("reject_friend_request", data);
}

export function deleteServer(data: { serverId: number }) {
    return socket.emitAck("delete_server", data);
}

export function pauseProducer() {
    return socket.emitAck("pause_producer");
}

export default ReactSocketIOProvider;