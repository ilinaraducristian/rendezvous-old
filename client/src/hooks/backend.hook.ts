import {useKeycloak} from "@react-keycloak/web";
import {useCallback} from "react";
import config from "../config";
import {ServersData} from "../types";
import {responseToSortedMap} from "../util/functions";

function useBackend() {

  const {keycloak} = useKeycloak();

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
  }, [keycloak]);

  // const getUsersData = useCallback(async (serversIds: number[]): Promise<Map<string, User>> => {
  //   if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
  //   const response = await fetch(`${config.backend}/users/get-data`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: keycloak.token,
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({servers_ids: serversIds})
  //   });
  //   const json = await response.json();
  //   return new Map<string, User>(json.users.map((user: User) => [user.id, user]));
  // }, [keycloak.token]);

  const createServer = useCallback(async (name: string) => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    let response: any = await fetch(`${config.backend}/servers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name
      })
    });
    response = await response.json();
    return response;
  }, [keycloak]);

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
    console.log(response);
    return response.invitation;
  }, [keycloak.token]);

  const joinServer = useCallback(async (invitation: string) => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    let response: any = await fetch(`${config.backend}/invitations/${invitation}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`
      }
    });
    response = await response.json();
    return response;
  }, [keycloak]);

  return {
    getUserServersData,
    createServer,
    createInvitation,
    joinServer
  };

}

export default useBackend;