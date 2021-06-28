import {useKeycloak} from "@react-keycloak/web";
import {useCallback} from "react";
import config from "../config";
import SortedMap from "../util/SortedMap";
import {Channel, Group, Member, Server, User} from "../types";

type ServersData = {
  servers: SortedMap<Server>,
  channels: SortedMap<Channel>,
  groups: SortedMap<Group>,
  members: SortedMap<Member>,
  users: Map<string, User>
}

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
    response.servers = new SortedMap<Server>(response.servers);
    response.channels = new SortedMap<Channel>(response.channels);
    response.groups = new SortedMap<Group>(response.groups);
    response.members = new SortedMap<Member>(response.members);
    response.users = new Map<string, User>(response.users);
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

  const createServer = useCallback((name: string, order: number) => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    return fetch(`${config.backend}/servers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        order
      })
    })
        .then(response => response.json())
        .then(response => ({
          id: response.id,
          name,
          userId: keycloak.subject as string,
          invitation: null,
          invitationExp: null,
          order: 0
        }));
  }, [keycloak]);

  const joinServer = useCallback((invitation: string) => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    return fetch(`${config.backend}/invitations/${invitation}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json"
      },
    }).then(response => response.json());
  }, [keycloak]);

  return {
    getUserServersData,
    // getUsersData,
    createServer,
    joinServer
  };

}

export default useBackend;