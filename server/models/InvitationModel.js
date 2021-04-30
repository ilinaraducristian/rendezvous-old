
const InvitationModel = {

    findOneByServerId: function (serverId) {
        return global.cappDB.execute('SELECT * FROM invitations WHERE server_id = ?', [serverId])
            .then(result => result[0][0]);
    },

    save: function (serverId, invitation, expirationDate) {
        return global.cappDB.execute('INSERT INTO invitations (server_id, invitation, expiration_date) VALUES (?, ?, ?)', [serverId, invitation, expirationDate])
            .then(result => result[0].insertId);
    },

    deleteById: function (id) {
        return global.cappDB.execute('DELETE FROM invitations WHERE id = ?', [id]);
    },

    findOneByInvitation: function (invitation) {
        return global.cappDB.execute('SELECT * FROM invitations WHERE invitation = ?', [invitation])
            .then(result => result[0][0]);
    }

};
export default InvitationModel;
