const MemberModel = {

    existsByUserIdAndServerIds: function (userId, serverIds) {
        if (serverIds.length === 0) return Promise.resolve(false);
        return global.cappDB.execute(`
            SELECT EXISTS(
                           SELECT 1
                           FROM members
                           WHERE user_id = '${userId}'
                             AND server_id IN (${serverIds})
                       )
        `).then(result => result[0][0][result[1][0]['name']] === 1);
    },

    findOneByUserIdAndServerId: function (userId, serverId) {
        return global.cappDB.execute('SELECT * FROM members WHERE user_id = ? AND server_id = ?', [userId, serverId])
            .then(result => result[0][0]);
    },

    save: function (userId, serverId) {
        return global.cappDB.execute('INSERT INTO members (user_id, server_id) VALUES (?, ?)', [userId, serverId])
            .then(result => result[0].insertId);
    }

};

export default MemberModel;
