import config from "./config";

function tokenHeader() {
    return {
        'Authorization': `Bearer ${Backend.keycloak.token}`
    };
}

const Backend = {
    keycloak: null,

    getServers: function () {
        return fetch(`${config.backend}/servers`, {
            method: 'GET',
            headers: {...tokenHeader()}
        })
            .then(response => response.json());
    },

    createServer: function (socketId, name) {
        return fetch(`${config.backend}/servers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...tokenHeader()
            },
            body: JSON.stringify({socket_id: socketId, name})
        })
            .then(response => response.json());
    },

    createChannel: function (socketId, serverId, name) {
        return fetch(`${config.backend}/servers/${serverId}/channels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...tokenHeader()
            },
            body: JSON.stringify({socket_id: socketId, channel_name: name})
        })
            .then(response => response.json());
    },

    createInvitation: function (server_id) {
        return fetch(`${config.backend}/invitations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...tokenHeader()
            },
            body: JSON.stringify({server_id})
        })
            .then(response => response.json());
    },

    joinServer: function (socketId, invitation) {
        return fetch(`${config.backend}/joinserver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...tokenHeader(),
            },
            body: JSON.stringify({socket_id: socketId, invitation})
        })
            .then(response => response.json());
    }

};

export default Backend;
