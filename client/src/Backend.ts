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

  createServer: function (name: string, order: number) {
    return fetch(`${config.backend}/servers`, {
      method: "POST",
      headers: {
        Authorization: Backend.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        order
      })
    }).then(response => response.json());
  }

};

export default Backend;