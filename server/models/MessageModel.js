const MessageModel = {

    findByChannelId: function (channelId) {
        return global.cappDB.execute('SELECT * FROM `messages` WHERE `channel_id"` = ?', [channelId]);
    }

};


export default MessageModel;
