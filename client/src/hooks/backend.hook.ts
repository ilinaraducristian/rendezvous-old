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
}

function useBackend() {

  const {keycloak} = useKeycloak();

  const getUserServersData = useCallback(async (): Promise<ServersData> => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    const response = await fetch(`${config.backend}/servers`, {
      method: "GET",
      headers: {
        Authorization: keycloak.token,
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  }, [keycloak]);

  const getUsersData = useCallback(async (usersIds: string[]): Promise<Map<string, User>> => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    const response = await fetch(`${config.backend}/users/get-data`, {
      method: "POST",
      headers: {
        Authorization: keycloak.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({usersIds})
    });
    const json = await response.json();
    return new Map<string, User>(json.users.map((user: User) => [user.id, user]));
  }, [keycloak.token]);

  const createServer = useCallback((name: string, order: number) => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    return fetch(`${config.backend}/servers`, {
      method: "POST",
      headers: {
        Authorization: keycloak.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        order
      })
    }).then(response => response.json());
  }, [keycloak]);

  const joinServer = useCallback((invitation: string) => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    return fetch(`${config.backend}/servers/invitations/${invitation}`, {
      method: "POST",
      headers: {
        Authorization: keycloak.token,
        "Content-Type": "application/json"
      },
    }).then(response => response.json());
  }, [keycloak]);

  return {
    getUserServersData,
    getUsersData,
    createServer,
    joinServer
  };

}

export default useBackend;