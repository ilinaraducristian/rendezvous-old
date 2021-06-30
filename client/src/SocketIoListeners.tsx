import {useContext, useEffect} from "react";
import {Actions, GlobalStates} from "./global-state";
import useSocketIo from "./hooks/socketio.hook";
import {Member, Message, User, Users} from "./types";
import {useSocketEvent} from "socket.io-react-hook";
import SortedMap from "./util/SortedMap";

function SocketIoListeners() {

  const {dispatch} = useContext(GlobalStates);

  const io = useSocketIo();
  const messageReceivedEvent = useSocketEvent<Message>(io.socket, "message_received");
  const newMemberEvent = useSocketEvent<{ member: Member, user: User }>(io.socket, "new_member");
  const userInfoUpdateEvent = useSocketEvent<User>(io.socket, "user_info_update");
  const testEvent = useSocketEvent<User>(io.socket, "test");

  useEffect(() => {
    if (testEvent.lastMessage === undefined) return;
    console.log(testEvent.lastMessage);
  }, [testEvent.lastMessage]);

  // useEffect(() => {
  //   console.log(io.connected);
  //   io.socket.on("new_member", payload => {
  //     console.log(payload);
  //   });
  // }, [io.connected, io.socket]);


  // useEffect(() => {
  //   dispatch({
  //     type: Actions.MESSAGES_SET, payload: (messages: SortedMap<Message>) =>
  //         new SortedMap<Message>(messages.set(messageReceivedEvent.lastMessage.id, messageReceivedEvent.lastMessage))
  //   });
  // }, [dispatch, messageReceivedEvent]);
  //

  useEffect(() => {
    console.log(newMemberEvent.lastMessage);

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