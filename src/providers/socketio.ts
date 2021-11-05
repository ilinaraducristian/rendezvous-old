import config from "config";
import {io, Socket} from "socket.io-client";
import {
    JoinVoiceChannelRequest,
    JoinVoiceChannelResponse,
    MoveChannelRequest,
    MoveChannelResponse,
    NewChannelRequest,
    NewChannelResponse
} from "dtos/channel.dto";
import {MoveGroupRequest, MoveGroupResponse, NewGroupRequest, NewGroupResponse} from "dtos/group.dto";
import {
    DeleteMessagesRequest,
    EditMessagesRequest,
    GetMessagesRequest,
    Message,
    NewMessageRequest
} from "dtos/message.dto";
import {
    ChangePermissionsRequest,
    ChangePermissionsResponse,
    JoinServerRequest,
    JoinServerResponse,
    MoveServerRequest,
    MoveServerResponse,
    NewInvitationRequest,
    NewInvitationResponse,
    NewServerRequest,
    NewServerResponse,
    UpdateServerImageRequest
} from "dtos/server.dto";
import {
    AcceptFriendRequest,
    SendFriendRequest,
    SendFriendRequestResponse,
    UserDataResponse,
    UserStatus
} from "dtos/user.dto";
import {store} from "state-management/store";
import {consumers, notificationSound} from "providers/mediasoup";
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
    setUserStatus,
    updatePermissions
} from "state-management/slices/data/data.slice";
import {
    ConnectTransportRequest,
    CreateConsumerRequest,
    CreateConsumersResponse,
    CreateProducerRequest,
    CreateTransportResponse,
    ResumeConsumerRequest,
    RouterCapabilitiesResponse
} from "dtos/mediasoup.dto";

function emitAck<R = any>(this: Socket, ev: string, ...args: any[]): Promise<R> {
    return new Promise(resolve => {
        if (args.length === 0)
            return this.emit(ev, 0, resolve);
        this.emit(ev, ...args, resolve);
    });
}

function connectAndWait(this: Socket): Promise<void> {
    return new Promise<void>(resolve => {

        function listener(this: Socket) {
            this.removeListener("connect", listener);
            resolve();
        }

        this.on("connect", listener);

        this.connect();

    });
}

const socket = Object.assign(io(config.socketIoUrl, {
    autoConnect: false,
    transports: ["websocket"],
    path: config.production ? "/api/socket.io" : undefined
}), {
    emitAck,
    connectAndWait,
    auth: {}
});

socket.on("new_message", (payload) => {
    store.dispatch(addMessages([payload]));
    if (document.hidden) {
        notificationSound.currentTime = 0;
        notificationSound.play();
    }
});

socket.on("new_member", (payload) => {
    store.dispatch(addMember(payload));
});

socket.on("new_channel", (payload) => {
    store.dispatch(addChannel(payload));
});

socket.on("new_group", (payload) => {
    store.dispatch(addGroup(payload));
});

socket.on("user_joined_voice-channel", (payload) => {
    store.dispatch(addChannelUsers([payload]));
});

socket.on("user_left_voice-channel", (payload) => {
    store.dispatch(removeChannelUsers([payload]));
});

socket.on("message_edited", (payload) => {
    store.dispatch(editMessageAction(payload));
});

socket.on("message_deleted", (payload) => {
    store.dispatch(deleteMessageAction(payload));
});

socket.on("new_friend_request", (payload) => {
    store.dispatch(addFriendRequest(payload));
});

socket.on("friend_request_accepted", () => {
    // store.dispatch(add)
});

socket.on("server_deleted", (payload) => {
    store.dispatch(deleteServerAction(payload));
});

socket.on("consumer_pause", (payload) => {
    const found = consumers.find(({consumer}) => consumer.id === payload.consumerId);
    if (found === undefined) return;
    found.consumer.pause();
});

socket.on("consumer_resume", (payload) => {
    const found = consumers.find(({consumer}) => consumer.id === payload.consumerId);
    if (found === undefined) return;
    found.consumer.resume();
});

socket.on("permissions_updated", (payload) => {
    store.dispatch(updatePermissions({role: payload.role}));
});

socket.on("offline", (payload) => {
    store.dispatch(setUserStatus({userId: payload.userId, status: UserStatus.offline}));
});

socket.on("online", (payload) => {
    store.dispatch(setUserStatus({userId: payload.userId, status: UserStatus.online}));
});

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
export const changePermissions = asyncGeneric<ChangePermissionsResponse, ChangePermissionsRequest>("change_permissions");

export function connectTransport(data: ConnectTransportRequest, callback: Function) {
    socket.emit("connect_transport", data, callback);
}

export function createProducer(data: CreateProducerRequest, callback: Function) {
    socket.emit("create_producer", data, callback);
}

export default socket;