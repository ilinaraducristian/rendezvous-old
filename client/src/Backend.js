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

    createServer: function (name) {
        return fetch(`${config.backend}/servers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...tokenHeader()
            },
            body: JSON.stringify({name})
        })
            .then(response => response.json());
    },

    createChannel: function (serverId, name) {
        return fetch(`${config.backend}/servers/${serverId}/channels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...tokenHeader()
            },
            body: JSON.stringify({channel_name: name})
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

    joinServer: function (invitation) {
        return fetch(`${config.backend}/joinserver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...tokenHeader(),
            },
            body: JSON.stringify({invitation})
        })
            .then(response => response.json());
    }

};

export default Backend;
