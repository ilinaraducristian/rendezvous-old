const ChannelModel = {

    save: function (serverId, name) {
        return global.cappDB.execute('INSERT INTO channels (server_id, name) VALUES (?, ?)', [serverId, name])
            .then(result => result[0].insertId);
    }

};

export default ChannelModel;
