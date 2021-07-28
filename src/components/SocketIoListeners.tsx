import {useContext, useEffect} from "react";
import {GlobalStates} from "../state-management/global-state";
import useSocketIo from "../hooks/socketio.hook";
import {Channel, Member, Message, User} from "../types";
import {useSocketEvent} from "socket.io-react-hook";
import Actions from "../state-management/actions";

function SocketIoListeners() {

  const {state, dispatch} = useContext(GlobalStates);

  const {socket} = useSocketIo();
  const newMessageEvent = useSocketEvent<Message>(socket, "new_message");
  const newMemberEvent = useSocketEvent<{ member: Member, user: User }>(socket, "new_member");
  const newChannelEvent = useSocketEvent<Channel>(socket, "new_channel");
  const newGroupEvent = useSocketEvent<Channel>(socket, "new_group");
  const userJoinedVoiceChannel = useSocketEvent<any>(socket, "user_joined_voice-channel");

  useEffect(() => {
    const {lastMessage} = userJoinedVoiceChannel;
    if (lastMessage === undefined) return;
    const channel = (state.channels.get(lastMessage.channelId) as Channel);
    channel.users?.push({socketId: lastMessage.socketId, userId: lastMessage.userId});
    channel.users = [...(channel.users as any[])];
    dispatch({type: Actions.CHANNELS_SET, payload: state.channels.set(channel.id, channel)});
  }, [userJoinedVoiceChannel.lastMessage]);

  useEffect(() => {
    const {lastMessage} = newMessageEvent;
    if (lastMessage === undefined) return;
    lastMessage.timestamp = new Date(lastMessage.timestamp);
    dispatch({
      type: Actions.MESSAGES_SET,
      payload: state.messages.set(lastMessage.id, lastMessage)
    });
  }, [state.messages, dispatch, newMessageEvent, newMessageEvent.lastMessage]);

  useEffect(() => {
    const {lastMessage} = newMemberEvent;
    if (lastMessage === undefined) return;
    dispatch({
      type: Actions.MEMBERS_SET,
      payload: state.members.set(lastMessage.member.id, lastMessage.member)
    });
    dispatch({
      type: Actions.USERS_SET,
      payload: state.users.set(lastMessage.user.id, lastMessage.user)
    });
  }, [state.members, state.users, dispatch, newMemberEvent, newMemberEvent.lastMessage]);

  useEffect(() => {
    const {lastMessage} = newChannelEvent;
    if (lastMessage === undefined) return;
    dispatch({
      type: Actions.CHANNELS_SET,
      payload: state.channels.set(lastMessage.id, lastMessage)
    });
  }, [state.channels, dispatch, newChannelEvent, newChannelEvent.lastMessage]);

  useEffect(() => {
    const {lastMessage} = newGroupEvent;
    if (lastMessage === undefined) return;
    dispatch({
      type: Actions.GROUPS_SET, payload: state.groups.set(lastMessage.id, lastMessage)
    });
  }, [state.groups, dispatch, newGroupEvent, newGroupEvent.lastMessage]);

  return <></>;

}

export default SocketIoListeners;