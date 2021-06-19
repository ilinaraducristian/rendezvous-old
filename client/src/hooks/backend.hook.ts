import {useKeycloak} from "@react-keycloak/web";
import {useCallback} from "react";
import config from "../config";

function useBackend() {

  const {keycloak} = useKeycloak();

  const getUserServers = useCallback(() => {
    if (keycloak.token === undefined) return Promise.reject({error: "Keycloak token is undefined"});
    return fetch(`${config.backend}/servers`, {
      method: "GET",
      headers: {
        Authorization: keycloak.token,
        "Content-Type": "application/json"
      }
    }).then(response => response.json());
  }, [keycloak]);

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
    getUserServers,
    createServer,
    joinServer
  };

}

export default useBackend;