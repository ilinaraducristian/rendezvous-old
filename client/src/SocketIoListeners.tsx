import {useContext, useEffect} from "react";
import {Actions, GlobalStates} from "./global-state";
import useSocketIo from "./hooks/socketio.hook";
import {Member, Message, User, Users} from "./types";
import {useSocketEvent} from "socket.io-react-hook";
import SortedMap from "./util/SortedMap";

function SocketIoListeners() {

  const {dispatch} = useContext(GlobalStates);

  const io = useSocketIo();
  const newMessageEvent = useSocketEvent<Message>(io.socket, "new_message");
  const newMemberEvent = useSocketEvent<{ member: Member, user: User }>(io.socket, "new_member");
  const userInfoUpdateEvent = useSocketEvent<User>(io.socket, "user_info_update");

  // useEffect(() => {
  //   console.log(io.connected);
  //   io.socket.on("new_member", payload => {
  //     console.log(payload);
  //   });
  // }, [io.connected, io.socket]);


  useEffect(() => {
    console.log(newMessageEvent.lastMessage);
    if (newMessageEvent.lastMessage === undefined) return;
    dispatch({
      type: Actions.MESSAGES_SET, payload: (messages: SortedMap<Message>) => {
        newMessageEvent.lastMessage.timestamp = new Date(newMessageEvent.lastMessage.timestamp);
        return new SortedMap<Message>(messages.set(newMessageEvent.lastMessage.id, newMessageEvent.lastMessage));
      }
    });
  }, [dispatch, newMessageEvent.lastMessage]);

  useEffect(() => {
    if (newMemberEvent.lastMessage === undefined) return;
    dispatch({
      type: Actions.MEMBERS_SET, payload: (members: SortedMap<Member>) =>
          new SortedMap<Member>(members.set(newMemberEvent.lastMessage.member.id, newMemberEvent.lastMessage.member))
    });
    dispatch({
      type: Actions.USERS_SET, payload: (users: Users) =>
          new Map<string, User>([...users.set(newMemberEvent.lastMessage.user.id, newMemberEvent.lastMessage.user)])
    });
  }, [dispatch, newMemberEvent.lastMessage]);
  //
  // useEffect(() => {
  //   dispatch({
  //     type: Actions.USERS_SET, payload: (users: Users) =>
  //         new Map<string, User>(users.set(userInfoUpdateEvent.lastMessage.id, userInfoUpdateEvent.lastMessage))
  //   });
  // }, [dispatch, userInfoUpdateEvent]);

  return <></>;

}

export default SocketIoListeners;