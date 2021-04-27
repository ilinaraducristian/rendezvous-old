const ChannelModel = {

    save: function (serverId, name) {
        return global.cappDB.execute('INSERT INTO `channels` (server_id, name) VALUES (?, ?)', [serverId, name]);
    }

};
export default ChannelModel;
