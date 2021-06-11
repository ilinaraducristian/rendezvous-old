import config from "./config";

const Backend = {

  token: "",

  getServers: function () {
    return fetch(`${config.backend}/servers`, {
      method: "GET",
      headers: {
        Authorization: Backend.token
      }
    }).then(response => response.json());
  },

  createServer: function (serverName: string) {
    return fetch(`${config.backend}/servers`, {
      method: "POST",
      headers: {
        Authorization: Backend.token
      },
      body: JSON.stringify({
        server_name: serverName
      })
    }).then(response => response.json());
  }

};

export default Backend;