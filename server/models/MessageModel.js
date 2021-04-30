const MessageModel = {

    save: function (userId, channelId, timestamp, text) {
        return global.cappDB.execute('INSERT INTO messages (user_id, channel_id, timestamp, text) VALUES(?, ?, ?, ?)', [userId, channelId, timestamp, text])
            .then(result => result[0].insertId);
    }

};

export default MessageModel;
