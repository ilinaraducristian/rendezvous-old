import config from "./config";
import {Server} from "./types";

const Backend = {

  token: "",

  getServers: function (): Promise<Server[]> {
    return fetch(`${config.backend}/servers`, {
      method: "GET",
      headers: {
        Authorization: Backend.token,
        "Content-Type": "application/json"
      }
    }).then(response => response.json());
  },

  createServer: function (name: string, order: number): Promise<Server> {
    return fetch(`${config.backend}/servers`, {
      method: "POST",
      headers: {
        Authorization: Backend.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        order
      })
    }).then(response => response.json());
  },

  joinServer: function (invitation: string): Promise<Server> {
    return fetch(`${config.backend}/servers/invitations/${invitation}`, {
      method: "POST",
      headers: {
        Authorization: Backend.token,
        "Content-Type": "application/json"
      },
    }).then(response => response.json());
  }

};

export default Backend;