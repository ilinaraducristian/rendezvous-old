import {useKeycloak} from "@react-keycloak/web";
import {useCallback} from "react";
import config from "../config";
import {Message} from "../types";
import {responseToSortedMap} from "../util/functions";
import useSocketIo from "./socketio.hook";
import SortedMap from "../util/SortedMap";

function useBackend() {

  const {keycloak} = useKeycloak();
  const {socket} = useSocketIo();

  const getUserServersData = useCallback(() =>
          socket.emitAck("get_user_servers_data")
              .then(responseToSortedMap)
      , [socket]);

  const createServer = useCallback((name: string) =>
          socket.emitAck("create_server", {name})
              .then(responseToSortedMap)
      , [socket]);

  const getMessages = useCallback(async (serverId: number, channelId: number, offset: number) => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    let response: any = await fetch(`${config.backend}/channels/${channelId}/messages?serverId=${serverId}&offset=${offset}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json"
      }
    });
    response = await response.json();
    response = response.map((message: [number, Message]) => {
      message[1].timestamp = new Date(message[1].timestamp);
      return message;
    });
    response = new SortedMap<Message>(response);
    return response;
  }, [keycloak.token]);

  const joinServer = useCallback((invitation: string) =>
          socket.emitAck("join_server", {invitation})
              .then(responseToSortedMap)
      , [socket]);

  const createInvitation = useCallback(async (serverId: number) => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    let response: any = await fetch(`${config.backend}/invitations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({serverId})
    });
    response = await response.json();
    return response.invitation;
  }, [keycloak.token]);

  const createChannel = useCallback((serverId: number, groupId: number | null, channelName: string) =>
          socket.emitAck("create_channel", {serverId, groupId, channelName})
      , [socket]);

  const createGroup = useCallback((serverId: number, groupName: string) =>
          socket.emitAck("create_group", {serverId, groupName})
      , [socket]);

  return {
    getUserServersData,
    createServer,
    createInvitation,
    joinServer,
    getMessages,
    createChannel,
    createGroup
  };

}

export default useBackend;