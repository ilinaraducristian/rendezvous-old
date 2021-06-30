import {useKeycloak} from "@react-keycloak/web";
import {useCallback} from "react";
import config from "../config";
import {ServersData} from "../types";
import {responseToSortedMap} from "../util/functions";
import useSocketIo from "./socketio.hook";

function useBackend() {

  const {keycloak} = useKeycloak();
  const {socket} = useSocketIo();

  const getUserServersData = useCallback(async (): Promise<ServersData> => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    let response: any = await fetch(`${config.backend}/servers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json"
      }
    });
    response = await response.json();
    response = responseToSortedMap(response);
    return response;
  }, [keycloak.token]);

  // const createServer = useCallback(async (name: string) => {
  //   if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
  //   let response: any = await fetch(`${config.backend}/servers`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${keycloak.token}`,
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       name
  //     })
  //   });
  //   response = await response.json();
  //   return responseToSortedMap(response);
  // }, [keycloak.token]);

  const createServer = useCallback((name: string) => {
    return new Promise((resolve, reject) => {
      socket.emit("create_server", {name}, (pac: any) => {
        resolve(responseToSortedMap(pac));
      });
    });
  }, [socket]);

  const joinServer = useCallback(async (invitation: string) => {
    return new Promise((resolve, reject) => {
      socket.emit("join_server", {invitation}, (pac: any) => {
        resolve(pac);
      });
    });
  }, [socket]);

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

  // const joinServer = useCallback(async (invitation: string) => {
  //   if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
  //   let response: any = await fetch(`${config.backend}/invitations/${invitation}`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${keycloak.token}`
  //     }
  //   });
  //   response = await response.json();
  //   return response;
  // }, [keycloak.token]);

  return {
    getUserServersData,
    createServer,
    createInvitation,
    joinServer
  };

}

export default useBackend;