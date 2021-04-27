const MemberModel = {

    findByUserIdAndServerId: function (userId, serverId) {
        return global.cappDB.execute('SELECT * FROM `members` WHERE `user_id` = ? AND `server_id` = ?', [userId, serverId]);
    },

    save: function (userId, serverId) {
        return global.cappDB.execute('INSERT INTO `members` (user_id, server_id) VALUES (?, ?)', [userId, serverId]);
    }

};

export default MemberModel;
