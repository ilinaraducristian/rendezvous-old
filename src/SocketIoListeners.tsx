import {useContext, useEffect} from "react";
import {Actions, GlobalStates} from "./global-state";
import useSocketIo from "./hooks/socketio.hook";
import {Channel, Member, Message, User, UsersMap} from "./types";
import {useSocketEvent} from "socket.io-react-hook";
import SortedMap from "./util/SortedMap";

function SocketIoListeners() {

  const {dispatch} = useContext(GlobalStates);

  const io = useSocketIo();
  const newMessageEvent = useSocketEvent<Message>(io.socket, "new_message");
  const newMemberEvent = useSocketEvent<{ member: Member, user: User }>(io.socket, "new_member");
  const newChannelEvent = useSocketEvent<Channel>(io.socket, "new_channel");
  const userInfoUpdateEvent = useSocketEvent<User>(io.socket, "user_info_update");

  // useEffect(() => {
  //   console.log(io.connected);
  //   io.socket.on("new_member", payload => {
  //     console.log(payload);
  //   });
  // }, [io.connected, io.socket]);


  useEffect(() => {
    if (newMessageEvent.lastMessage === undefined) return;
    dispatch({
      type: Actions.MESSAGES_SET, payload: (messages: SortedMap<Message>) => {
        newMessageEvent.lastMessage.timestamp = new Date(newMessageEvent.lastMessage.timestamp);
        return messages.set(newMessageEvent.lastMessage.id, newMessageEvent.lastMessage).clone();
      }
    });
  }, [dispatch, newMessageEvent.lastMessage]);

  useEffect(() => {
    if (newMemberEvent.lastMessage === undefined) return;
    dispatch({
      type: Actions.MEMBERS_SET, payload: (members: SortedMap<Member>) =>
          members.set(newMemberEvent.lastMessage.member.id, newMemberEvent.lastMessage.member).clone()
    });
    dispatch({
      type: Actions.USERS_SET, payload: (users: UsersMap) =>
          new UsersMap(users.set(newMemberEvent.lastMessage.user.id, newMemberEvent.lastMessage.user))
    });
  }, [dispatch, newMemberEvent.lastMessage]);

  useEffect(() => {
    if (newChannelEvent.lastMessage === undefined) return;
    dispatch({
      type: Actions.CHANNELS_SET, payload: (channels: SortedMap<Channel>) =>
          channels.set(newChannelEvent.lastMessage.id, newChannelEvent.lastMessage).clone()
    });
  }, [dispatch, newChannelEvent.lastMessage]);

  return <></>;

}

export default SocketIoListeners;