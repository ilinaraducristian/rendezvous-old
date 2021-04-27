const ServerModel = {

    findById: function (id) {
        return global.cappDB.execute('SELECT * FROM `servers` WHERE `id` = ?', [id]);
    },

    findOneByIdLeftJoinChannelsLeftJoinMessages: function (id) {
        return global.cappDB.execute(
            `SELECT s.\`id\`      AS \`server_id\`,
                    s.\`name\`    AS \`server_name\`,
                    c.\`id\`      AS \`channel_id\`,
                    c.\`name\`    AS \`channel_name\`,
                    m.\`id\`      AS \`message_id\`,
                    m.\`user_id\` AS \`sender\`,
                    m.\`text\`    AS \`message\`
             FROM \`capp\`.\`servers\` s
                      LEFT JOIN \`capp\`.\`channels\` c ON s.\`id\` = c.\`server_id\`
                      LEFT JOIN \`capp\`.\`messages\` m ON m.\`channel_id\` = c.\`id\`
             WHERE s.\`id\` = ?
             ORDER BY \`server_id\`, \`channel_id\``,
            [id]);
    },

    findAllByUserIdLeftJoinChannelsLeftJoinMessages: function (userId) {
        return global.cappDB.execute(`
            SELECT s.\`id\`      AS \`server_id\`,
                   s.\`name\`    AS \`server_name\`,
                   c.\`id\`      AS \`channel_id\`,
                   c.\`name\`    AS \`channel_name\`,
                   m.\`id\`      AS \`message_id\`,
                   m.\`user_id\` AS \`sender\`,
                   m.\`text\`    AS \`message\`
            FROM \`capp\`.\`servers\` s
                     JOIN \`capp\`.\`members\` on \`s\`.id = \`members\`.\`server_id\`
                     LEFT JOIN \`capp\`.\`channels\` c ON s.id = c.server_id
                     LEFT JOIN \`capp\`.\`messages\` m ON m.channel_id = c.id
            WHERE \`members\`.\`user_id\` = '?'
            ORDER BY \`server_id\`, \`channel_id\`;
        `, [userId]);
    },

    save: function (name, userId) {
        return global.cappDB.execute('INSERT INTO `servers` (user_id, name) VALUES (?, ?)', [userId, name]);
    }

};
export default ServerModel;
