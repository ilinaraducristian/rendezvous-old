import React, {useEffect, useState} from 'react';
import {useKeycloak} from '@react-keycloak/web';
import Loading from "./Loading";
import ServersPanel from "./ServersPanel";
import MessagesPanel from "./MessagesPanel";
import ChannelsPanel from "./ChannelsPanel";
import MembersPanel from "./MembersPanel";
import AddServerOverlay from "./AddServerOverlay";
import CreateChannelOverlay from "./CreateChannelOverlay.js";
import Backend from "../Backend";
import Overlay from "./Overlay";
import InvitationOverlay from "./InvitationOverlay";
import {io} from "socket.io-client";
import config from "../config.js";

let socket;

function Chat() {

    const {keycloak, initialized} = useKeycloak();
    Backend.keycloak = keycloak;

    let username = 'user1';

    const mockMessage1 = {
        timestamp: '13:45',
        sender: 'user1',
        text: 'Mesaj 1'
    };

    const mockMessage2 = {
        timestamp: '13:37',
        sender: 'user1',
        text: 'Mesaj 2'
    };

    const mockMessage3 = {
        timestamp: '13:46',
        sender: 'user1',
        text: 'Mesaj 3'
    };

    const mockChannel = {
        id: 15,
        name: "general",
        messages: new Map([[0, mockMessage1], [1, mockMessage2], [2, mockMessage3]])
    };

    const mockServer = {
        id: 17,
        name: 'A nice server',
        channels: new Map([[15, mockChannel]]),
        members: new Map([[30, {username: 'user1', name: 'Display name'}]])
    };

    // const [serversObject, setServersObject] = useState({servers: new Map([[17, mockServer]])});
    const [serversObject, setServersObject] = useState({servers: new Map()});
    const [serverObject, setServerObject] = useState({});
    const [channelObject, setChannelObject] = useState({});
    const [overlay, setOverlay] = useState({active: false});

    useEffect(() => {
        async function _useEffect() {
            if (initialized && !keycloak.authenticated) {
                keycloak.login();
            }
            if (!initialized || !keycloak.authenticated) return;
            await keycloak.loadUserProfile();
            username = keycloak.profile.username;

            const token = keycloak.token;

            const response = await Backend.getServers();
            response.servers.forEach(server => {
                server[1].channels.forEach(channel => {
                    channel[1].messages = new Map(channel[1].messages);
                });
                server[1].channels = new Map(server[1].channels);
            });

            setServersObject({servers: new Map(response.servers)});

            socket = io(config.backend, {
                auth: {token}
            });

            socket.emit('join_servers', {servers: response.servers.map(server => server[0])});
            console.log('useEffect()');
        }

        _useEffect();

    }, []);

    function onMessageReceived(payload) {
        if (!(serversObject?.servers && channelObject?.channel && serverObject?.server)) return;
        const id = channelObject.channel.id;
        serversObject
            .servers.get(payload['server_id'])
            .channels.get(payload['channel_id'])
            .messages.set(payload['message']['id'], payload['message']);
        setServersObject({servers: serversObject.servers});
        setChannelObject({channel: serverObject.server.channels.get(id)});
    }

    function onChannelCreated(payload) {
        const server = serversObject.servers.get(payload['server_id']);
        server.channels.set(payload['id'], {
            id: payload['id'],
            name: payload['channel_name'],
            messages: new Map()
        });
        setServersObject({servers: serversObject.servers});
        setServerObject({server});
    }

    useEffect(() => {
        socket?.on('message_received', onMessageReceived);
        socket?.on('channel_created', onChannelCreated);
    }, [socket, serversObject, serverObject, channelObject]);

    function showAddServerOverlay() {
        setOverlay({
            title: 'Create a server',
            description: 'Create a new server or join an existing one',
            content: <AddServerOverlay onCreateServer={createServer} onJoinServer={joinServer}/>,
            active: true
        });
    }

    function createServer(name) {
        Backend.createServer(socket.id, name)
            .then((response) => {
                serversObject.servers.set(response.id, {id: response.id, name, channels: new Map()});
                setServersObject({servers: serversObject.servers});
                setOverlay({active: false});
            });
    }

    function joinServer(invitation) {
        Backend.joinServer(socket.id, invitation)
            .then((response) => {
                const server = response.server;
                server.channels.forEach(channel => {
                    channel[1].messages = new Map(channel[1].messages);
                });
                server.channels = new Map(server.channels);
                serversObject.servers.set(server.id, server);
                setServersObject({servers: serversObject.servers});
                setChannelObject({});
                setServerObject({server});
                setOverlay({active: false});
            });
    }

    function showCreateChannelOverlay() {
        setOverlay({
            title: 'New channel',
            description: 'Enter the channel name',
            content: <CreateChannelOverlay onCreateChannel={createChannel}/>,
            active: true
        });
    }

    function createChannel(name) {
        Backend.createChannel(socket.id, serverObject.server?.id, name)
            .then(response => {
                const channel = {
                    id: response.id,
                    name,
                    messages: new Map()
                };
                serversObject.servers.get(serverObject.server?.id).channels.set(response.id, channel);
                setServersObject({servers: serversObject.servers});
                // setServerObject({server: serversObject.servers.get(serverObject.server?.id)});
                setChannelObject({channel});
                setOverlay(false);
            });
    }

    function showInvitationOverlay() {
        const overlay = {
            active: true,
            title: 'Invite friends',
            description: 'Share this invitation code with your friends'
        };
        Backend.createInvitation(serverObject.server?.id)
            .then(response => {
                overlay.content = <InvitationOverlay invitation={response.invitation}/>;
                setOverlay(overlay);
            });
    }

    function deleteServer() {

    }

    function sendMessage(text) {
        socket.emit('send_message', {
                server_id: serverObject.server.id,
                channel_id: channelObject.channel.id,
                text
            },
            (payload) => {
                serversObject.servers.get(serverObject.server.id)
                    .channels.get(channelObject.channel.id)
                    .messages.set(payload.id, {
                    sender: username,
                    text,
                    timestamp: payload['timestamp']
                });
                setServersObject({servers: serversObject.servers});
                setChannelObject({channel: channelObject.channel});
            }
        );
    }

    if (!keycloak?.authenticated) return (<Loading/>);

    return [(
        <div key={"chat_component"} className="main">
            <ServersPanel
                servers={serversObject.servers}
                onAddServer={showAddServerOverlay}
                onSelectServer={id => {
                    setChannelObject({});
                    setServerObject({server: serversObject.servers.get(id)});
                }}
            />

            <ChannelsPanel
                channels={serverObject.server?.channels}
                serverName={serverObject.server?.name}
                onSelectChannel={id => {
                    setChannelObject({channel: serverObject.server.channels.get(id)});
                }}
                onCreateChannel={showCreateChannelOverlay}
                onCreateInvitation={showInvitationOverlay}
                onDeleteServer={id => {
                }}
            />

            <MessagesPanel
                messages={channelObject.channel?.messages}
                onSendMessage={sendMessage}
            />

            <MembersPanel
                members={serverObject.server?.members}
            />

        </div>
    ),
        (
            overlay.active ?
                <Overlay
                    key={"overlay_component"}
                    overlay={overlay}
                    onClose={() => setOverlay({active: false})}
                />
                : null
        )];
}

export default Chat;
