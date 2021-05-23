const ServerModel = {

    findById: function (id) {
        return global.cappDB.execute('SELECT * FROM servers WHERE id = ?', [id])
            .then(result => result[0][0]);
    },

    findOneByIdLeftJoinChannelsLeftJoinMessages: function (id) {
        return global.cappDB.execute(`
            SELECT s.id        AS server_id,
                   s.name      AS server_name,
                   c.id        AS channel_id,
                   c.name      AS channel_name,
                   m.id        AS message_id,
                   m.user_id   AS sender,
                   m.timestamp AS timestamp,
                   m.text      AS message
            FROM capp.servers s
                     LEFT JOIN capp.channels c ON s.id = c.server_id
                     LEFT JOIN capp.messages m ON m.channel_id = c.id
            WHERE s.id = ?
            ORDER BY server_id, channel_id, message_id
        `, [id]).then(result => result[0]);
    },

    findAllByUserIdLeftJoinChannelsLeftJoinMessages: function (userId) {
        return global.cappDB.execute(`
            SELECT s.id        AS server_id,
                   s.name      AS server_name,
                   c.id        AS channel_id,
                   c.name      AS channel_name,
                   m.id        AS message_id,
                   u.USERNAME  AS sender,
                   m.timestamp AS timestamp,
                   m.text      AS text
            FROM capp.servers s
                     JOIN capp.members m1 on m1.server_id = s.id
                     LEFT JOIN capp.channels c ON c.server_id = s.id
                     LEFT JOIN capp.messages m ON m.channel_id = c.id
                     LEFT JOIN keycloak.USER_ENTITY u ON u.ID = m.user_id
            WHERE m1.user_id = ?
            ORDER BY server_id, channel_id, message_id
        `, [userId]).then(result => result[0]);
    },

    save: function (name, userId) {
        return global.cappDB.execute('INSERT INTO servers (user_id, name) VALUES (?, ?)', [userId, name])
            .then(result => result[0].insertId);
    }

};
export default ServerModel;
