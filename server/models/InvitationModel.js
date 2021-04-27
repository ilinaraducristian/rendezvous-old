import util from "../util.js";

const InvitationModel = {

    findByServerId: function (serverId) {
        return global.cappDB.execute('SELECT * FROM `invitations` WHERE `server_id` = ?', [serverId]);
    },

    save: function (serverId, invitation, expirationDate) {
        return global.cappDB.execute('INSERT INTO `invitations` (server_id, invitation, expiration_date) VALUES (?, ?, ?)', [serverId, invitation, util.dateToMysqlDatetime(expirationDate)]);
    },

    deleteById: function (id) {
        return global.cappDB.execute('DELETE FROM `invitations` WHERE `id` = ?', [id]);
    },

    findByInvitation: function (invitation) {
        return global.cappDB.execute('SELECT * FROM `invitations` WHERE invitation = ?', [invitation]);
    }

};
export default InvitationModel;
