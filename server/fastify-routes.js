import ServerModel from "./models/ServerModel.js";
import InvitationModel from "./models/InvitationModel.js";
import {v4 as uuid} from 'uuid';
import MemberModel from "./models/MemberModel.js";
import ChannelModel from "./models/ChannelModel.js";

function fastifyRoutes(fastify, io) {

    fastify.post('/servers', createServer);
    fastify.post('/joinserver', joinServer);
    fastify.post('/servers/:id/channels', createChannel);
    fastify.post('/invitations', createInvitation);
    fastify.get('/servers', getServers);

    async function createServer(req, res) {
        try {
            const id = await ServerModel.save(req.body.name, req.auth.sub);
            await MemberModel.save(req.auth.sub, id);
            io.sockets.sockets.get(req.body['socket_id']).join(`server_${id}`);
            res.send({id});
        } catch (err) {
            console.log(err);
            res.code(500).send();
        }
    }

    async function joinServer(req, res) {
        const invitationCode = req.body.invitation;
        try {
            const invitation = await InvitationModel.findOneByInvitation(invitationCode);
            if (invitation === undefined) {
                res.code(400);
                return {error: "Invitation doesn't exist"};
            }
            const invitationExp = new Date(invitation['expiration_date']);
            const now = new Date();
            if (now >= invitationExp) {
                await InvitationModel.deleteById(invitation.id);
                res.code(400);
                return {error: 'Invitation expired'};
            }
            await MemberModel.save(req.auth.sub, invitation['server_id']);
            const serverData = await ServerModel.findOneByIdLeftJoinChannelsLeftJoinMessages(invitation['server_id']);
            const servers = await parseServerData(serverData);
            io.sockets.sockets.get(req.body['socket_id']).join(`server_${invitation['server_id']}`);
            return {server: servers[0][1]};
        } catch (err) {
            console.log(err);
            res.code(500).send();
        }
    }

    async function getServers(req, res) {
        try {
            let servers = await ServerModel.findAllByUserIdLeftJoinChannelsLeftJoinMessages(req.auth.sub);
            servers = parseServerData(servers);
            return {servers};
        } catch (err) {
            console.log(err);
            res.code(500).send();
        }
    }

    async function createChannel(req, res) {
        try {
            const server = await ServerModel.findById(req.params.id);
            if (server === undefined) {
                res.code(404);
                return {error: 'Server not found'};
            }
            const id = await ChannelModel.save(server.id, req.body['channel_name']);
            io.sockets.sockets.get(req.body['socket_id'])
                .to(`server_${req.params.id}`)
                .emit('channel_created', ({
                    id,
                    server_id: parseInt(req.params.id),
                    channel_name: req.body['channel_name']
                }));
            return {id};
        } catch (err) {
            console.log(err);
            res.code(500).send();
        }
    }

    async function createInvitation(req, res) {
        const serverId = req.body['server_id'];
        try {
            const member = await MemberModel.findOneByUserIdAndServerId(req.auth.sub, serverId);
            if (member === undefined) {
                res.code(400);
                return {error: 'You are not a member of this server'};
            }
            let invitation = await InvitationModel.findOneByServerId(serverId);
            if (invitation !== undefined) {
                const invitationExp = new Date(invitation['expiration_date']);
                const now = new Date();
                if (now < invitationExp) {
                    return {invitation: invitation.invitation};
                }
                await InvitationModel.deleteById(invitation.id);
            }
            const invitationCode = uuid();
            const id = await InvitationModel.save(serverId, invitationCode, new Date(new Date().getTime() + 5 * 60000));
            return {invitation: invitationCode, id};
        } catch (err) {
            console.log(err);
            res.code(500).send();
        }
    }

    /**
     * Convert the received SQL rows to an array of objects.
     * The resulting array and the nested ones can be converted to a map
     * with new Map(servers).
     * @param serversData
     * @returns {*[]}
     */
    function parseServerData(serversData) {
        const servers = [];
        let lastServerId = -1, lastChannelId = -1;
        serversData.forEach(row => {
            const server_id = row['server_id'];
            const channel_id = row['channel_id'];
            const message_id = row['message_id'];
            if (server_id === null) return;
            if (server_id > lastServerId) {
                lastServerId = server_id;
                const server = {
                    id: server_id,
                    name: row['server_name'],
                    channels: []
                };
                servers.push([server_id, server]);
            }
            if (channel_id === null) return;
            if (channel_id > lastChannelId) {
                lastChannelId = channel_id;
                const channel = {
                    id: channel_id,
                    name: row['channel_name'],
                    messages: []
                };
                servers[servers.length - 1][1].channels.push([channel_id, channel]);
            }
            if (row['message_id'] === null) return;
            const message = {
                id: message_id,
                sender: row['sender'],
                timestamp: row['timestamp'],
                text: row['text'],
            };
            const server = servers[servers.length - 1][1];
            server.channels[server.channels.length - 1][1].messages.push([message_id, message]);
        });
        return servers;
    }

}

export default fastifyRoutes;
