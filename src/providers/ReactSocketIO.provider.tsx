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
import {MoveGroupRequest, MoveGroupResponse, NewGroupRequest, NewGroupResponse} from "dtos/group.dto";
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
    MoveServerRequest,
    MoveServerResponse,
    NewInvitationRequest,
    NewInvitationResponse,
    NewServerRequest,
    NewServerResponse,
    UpdateServerImageRequest,
} from "dtos/server.dto";
import {AcceptFriendRequest, SendFriendRequest, SendFriendRequestResponse, UserDataResponse} from "dtos/user.dto";
import {useAppDispatch} from "state-management/store";
import {notificationSound} from "providers/ReactMediasoup.provider";
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
    removeChannelUsers,
} from "state-management/slices/data/data.slice";
import {
    ConnectTransportRequest,
    CreateConsumerRequest,
    CreateConsumersResponse,
    CreateProducerRequest,
    CreateTransportResponse,
    ResumeConsumerRequest,
    RouterCapabilitiesResponse,
} from "dtos/mediasoup.dto";

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

    function updateState() {
        setState({...state});
    }

    useEffect(() => {
        initialObject.socket.on("connect", () => {
            initialObject.connected = true;
            updateState();
        });

        initialObject.socket.on("disconnect", () => {
            initialObject.connected = false;
            updateState();
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

        initialObject.socket.on("user_left_voice-channel", (payload) => {
            dispatch(removeChannelUsers([payload]));
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

        setState(initialObject);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SocketIOContext.Provider value={state}>
            {children}
        </SocketIOContext.Provider>
    );
}

export const useSocket = () => useContext(SocketIOContext);

function asyncGeneric<R = void, T = void>(name: string): (data: T) => Promise<R> {
    return (data: T) => socket.emitAck(name, data);
}

export const pauseProducer = asyncGeneric<void, any>("pause_producer");
export const closeProducer = asyncGeneric("close_producer");
export const closeTransports = asyncGeneric("close_transports");
export const getUserData = asyncGeneric<UserDataResponse>("get_user_data");
export const rejectFriendRequest = asyncGeneric<any, any>("reject_friend_request");
export const sendMessage = asyncGeneric<Message, NewMessageRequest>("send_message");
export const editMessage = asyncGeneric<string, EditMessagesRequest>("edit_message");
export const deleteServer = asyncGeneric<void, { serverId: number }>("delete_server");
export const getMessages = asyncGeneric<Message[], GetMessagesRequest>("get_messages");
export const moveGroup = asyncGeneric<MoveGroupResponse, MoveGroupRequest>("move_group");
export const createGroup = asyncGeneric<NewGroupResponse, NewGroupRequest>("create_group");
export const deleteMessage = asyncGeneric<string, DeleteMessagesRequest>("delete_message");
export const resumeConsumer = asyncGeneric<void, ResumeConsumerRequest>("resume_consumer");
export const createTransports = asyncGeneric<CreateTransportResponse>("create_transports");
export const moveServer = asyncGeneric<MoveServerResponse, MoveServerRequest>("move_server");
export const joinServer = asyncGeneric<JoinServerResponse, JoinServerRequest>("join_server");
export const createServer = asyncGeneric<NewServerResponse, NewServerRequest>("create_server");
export const moveChannel = asyncGeneric<MoveChannelResponse, MoveChannelRequest>("move_channel");
export const createChannel = asyncGeneric<NewChannelResponse, NewChannelRequest>("create_channel");
export const acceptFriendRequest = asyncGeneric<any, AcceptFriendRequest>("accept_friend_request");
export const updateServerImage = asyncGeneric<void, UpdateServerImageRequest>("update_server_image");
export const getRouterCapabilities = asyncGeneric<RouterCapabilitiesResponse>("get_router_capabilities");
export const createConsumers = asyncGeneric<CreateConsumersResponse, CreateConsumerRequest>("create_consumer");
export const createInvitation = asyncGeneric<NewInvitationResponse, NewInvitationRequest>("create_invitation");
export const sendFriendRequest = asyncGeneric<SendFriendRequestResponse, SendFriendRequest>("send_friend_request");
export const joinVoiceChannel = asyncGeneric<JoinVoiceChannelResponse, JoinVoiceChannelRequest>("join_voice_channel");
export const leaveVoiceChannel = asyncGeneric<JoinVoiceChannelResponse, JoinVoiceChannelRequest>("leave_voice_channel");

export function connectTransport(data: ConnectTransportRequest, callback: Function) {
    socket.emit("connect_transport", data, callback);
}

export function createProducer(data: CreateProducerRequest, callback: Function) {
    socket.emit("create_producer", data, callback);
}

export default ReactSocketIOProvider;