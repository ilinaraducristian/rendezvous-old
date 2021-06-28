import useSocketIo from "./util/use-socket-io";
import {useSocketEvent} from "socket.io-react-hook";
import {Member, Message, User} from "./types";
import {useContext, useEffect} from "react";
import SortedMap from "./util/SortedMap";
import {Actions, GlobalStates} from "./global-state";

function SocketIOListeners() {

  const {dispatch} = useContext(GlobalStates);

  const io = useSocketIo();
  const messageReceivedEvent = useSocketEvent<Message>(io.socket, "message_received");
  const newMemberEvent = useSocketEvent<Member>(io.socket, "new_member");
  const userInfoUpdateEvent = useSocketEvent<User>(io.socket, "user_info_update");

  useEffect(() => {
    dispatch({
      type: Actions.MESSAGES_SET, payload: (messages: SortedMap<Message>) =>
          new SortedMap<Message>(messages.set(messageReceivedEvent.lastMessage.id, messageReceivedEvent.lastMessage))
    });
  }, [dispatch, messageReceivedEvent]);

  useEffect(() => {
    dispatch({
      type: Actions.MEMBERS_SET, payload: (members: SortedMap<Member>) =>
          new SortedMap<Member>(members.set(newMemberEvent.lastMessage.id, newMemberEvent.lastMessage))
    });
  }, [dispatch, newMemberEvent]);

  useEffect(() => {
    dispatch({
      type: Actions.USERS_SET, payload: (users: Map<string, User>) =>
          new Map<string, User>(users.set(userInfoUpdateEvent.lastMessage.id, userInfoUpdateEvent.lastMessage))
    });
  }, [dispatch, userInfoUpdateEvent]);

  return <></>;

}

export default SocketIOListeners;