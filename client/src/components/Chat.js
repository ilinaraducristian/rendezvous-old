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

function Chat() {

    const {keycloak, initialized} = useKeycloak();
    Backend.keycloak = keycloak;
    // TODO GET USERNAME:
    let username;
    // keycloak.profile or keycloak.userInfo

    let socket, invitation;

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
        channels: new Map([[0, mockChannel]]),
        members: new Map([[0, {username: 'user1', name: 'Display name'}]])
    };

    // const [serversObject, setServersObject] = useState({servers: new Map([[0, mockServer]])});
    const [serversObject, setServersObject] = useState({servers: new Map()});
    const [server, setServer] = useState({});
    const [channel, setChannel] = useState({});
    const [overlay, setOverlay] = useState({active: false});

    useEffect(async () => {
        if (initialized && !keycloak.authenticated) {
            keycloak.login();
        }
        if (!initialized || !keycloak.authenticated) return;
        const token = keycloak.token;

        const response = await Backend.getServers();
        response.servers.forEach(server => {
            server[1].channels.forEach(channel => {
                channel[1].messages = new Map(channel[1].messages);
            });
            server[1].channels = new Map(server[1].channels);
        });

        setServersObject({servers: new Map(response.servers)});

        // socket = io(config.backend, {auth: {token}});
        // socket.on('message_receivedd', onMessageReceived);
    }, []);

    function onMessageReceived(payload) {
        serversObject
            .servers.get(payload.server_id)
            .channels.get(payload.channel_id)
            .messages.set(payload.message.id, payload.text);
        setServersObject({severs: serversObject.severs});
    }

    function deleteServer() {

    }


    function showInvitationOverlay() {
        const overlay = {
            title: 'Invite friends',
            description: 'Share this invitation code with your friends'
        };
        Backend.createInvitation(server.id)
            .then(response => {
                overlay.content = (<InvitationOverlay invitation={response.invitation}/>);
                setOverlay(overlay);
            });
    }

    function createChannel(name) {
        Backend.createChannel(server.id, name)
            .then(response => {
                const channel = serversObject.servers.get(server.id).channels.set(response.id, {
                    id: response.id,
                    name
                });
                setServersObject({servers: serversObject.servers});
                setOverlay(false);
                setChannel(channel);
            });
    }

    function showNewChannelOverlay() {
        setOverlay({
            title: 'New channel',
            description: 'Enter the channel name',
            content: <CreateChannelOverlay onCreateChannel={createChannel}/>,
            active: true
        });
    }

    function createServer(name) {
        Backend.createServer(name)
            .then((response) => {
                serversObject.servers.set(response.id, {id: response.id, name});
                setServersObject({servers: serversObject.servers});
                setOverlay({active: false});
            });
    }

    function joinServer(invitation) {
        Backend.joinServer(invitation)
            .then((response) => {
                const server = response.server;
                server.channels.forEach(channel => {
                    channel[1].messages = new Map(channel[1].messages);
                });
                server.channels = new Map(server.channels);
                serversObject.servers.set(server.id, server);
                setServersObject({servers: serversObject.servers});
                setChannel({});
                setServer(server);
                setOverlay({active: false});
            });
    }

    function showAddServerOverlay() {
        setOverlay({
            title: 'Create a server',
            description: 'Create a new server or join an existing one',
            content: <AddServerOverlay onCreateServer={createServer} onJoinServer={joinServer}/>,
            active: true
        });
    }

    function sendMessage(message) {
        socket.emit('send_message', {
            message, channel_id: channel.id, cb: ({status, timestamp}) => {
                console.log(status); // ok or not
                // if ok display message
                channel.messages.push({sender: username, message, timestamp});
            }
        });
    }

    if (!keycloak?.authenticated) return (<Loading/>);

    return [(
        <div key={"chat_component"} className="main">
            <ServersPanel
                servers={serversObject.servers}
                onAddServer={showAddServerOverlay}
                onSelectServer={id => {
                    setChannel({});
                    setServer(serversObject.servers.get(id));
                }}
            />

            <ChannelsPanel
                channels={server.channels}
                serverName={server.name}
                onSelectChannel={id => setChannel(server.channels.get(id))}
                onCreateChannel={showNewChannelOverlay}
                onCreateInvitation={showInvitationOverlay}
                onDeleteServer={id => {
                }}
            />

            <MessagesPanel
                messages={channel.messages}
                onSendMessage={sendMessage}
            />

            <MembersPanel
                members={server.members}
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
