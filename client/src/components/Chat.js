import React, {useCallback, useEffect, useState} from 'react';
import {useKeycloak} from '@react-keycloak/web';
import ServersPanel from "./ServersPanel";
import ChannelsPanel from "./ChannelsPanel";
import Backend from "../Backend";
import ContentPanel from "./ContentPanel.js";
import {mockServers, mockUsers} from "../mockData.js";
import {ChannelsPanelContext} from '../contexts.js';
import Channel from "./Channel.js";
import Group from "./Group.js";

let servers, users;

function Chat() {

    const {keycloak, initialized} = useKeycloak();
    Backend.keycloak = keycloak;

    let username = 'user1';
    const [socket, setSocket] = useState();

    // const [serversObject, setServersObject] = useState({servers: new Map([[1, mockServers]])});
    // const [serversObject, setServersObject] = useState({servers: new Map()});
    const [serverObject, setServerObject] = useState({});
    const [channelObject, setChannelObject] = useState({});
    const [overlay, setOverlay] = useState({active: false});

    /**
     * Update the ServersPanel only when info about some servers changes, for ex:
     * user creates or joins a server, a server changes it's icon or name.
     */
    const [serversPanel, setServersPanel] = useState([]);

    /**
     * Update the ChannelsPanel only when info about a the selected server
     * changes, for ex: server has a new name, adds, removes or modifies
     * existing channels.
     */
    const [channelsPanel, setChannelsPanel] = useState({
        serverId: null,
        serverName: null,
        groups: null,
        channels: null
    });

    const [contentPanel, setContentPanel] = useState({channel: null});

    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        // get servers from backend
        servers = mockServers;
        // also get members
        users = mockUsers;
        let _servers = [];
        servers.forEach(server => {
            _servers.push({id: server.id, name: server.name});
        });
        setServersPanel(_servers);
    }, []);

    // useEffect(() => {
    //     async function _useEffect() {
    //         if (initialized && !keycloak.authenticated) {
    //             keycloak.login();
    //         }
    //         if (!initialized || !keycloak.authenticated) return;
    //         await keycloak.loadUserProfile();
    //         username = keycloak.profile.username;
    //
    //         const response = await Backend.getServers();
    //         response.servers.forEach(server => {
    //             server[1].channels.forEach(channel => {
    //                 channel[1].messages = new Map(channel[1].messages);
    //             });
    //             server[1].channels = new Map(server[1].channels);
    //         });
    //
    //         setServersObject({servers: new Map(response.servers)});
    //         const _socket = io(config.backend, {
    //             auth: {token: keycloak.token}
    //         });
    //
    //         _socket.emit('join_servers', {servers: response.servers.map(server => server[0])});
    //         setSocket(_socket);
    //
    //         console.log('useEffect()');
    //     }
    //
    //     _useEffect();
    //
    // }, []);
//
    // useEffect(() => {
    //     keycloak.onAuthRefreshSuccess = () => {
    //         if (socket)
    //             socket.auth.token = keycloak.token;
    //     };
    // }, [socket]);
    //
    // useEffect(() => {
    //     socket?.on('message_received', onMessageReceived);
    //     socket?.on('channel_created', onChannelCreated);
    // }, [socket, serversObject, serverObject, channelObject]);

    // function onMessageReceived(payload) {
    //     if (!(serversObject?.servers && channelObject?.channel && serverObject?.server)) return;
    //     const id = channelObject.channel.id;
    //     serversObject
    //         .servers.get(payload['server_id'])
    //         .channels.get(payload['channel_id'])
    //         .messages.set(payload['message']['id'], payload['message']);
    //     setServersObject({servers: serversObject.servers});
    //     setChannelObject({channel: serverObject.server.channels.get(id)});
    // }
    //
    // function onChannelCreated(payload) {
    //     const server = serversObject.servers.get(payload['server_id']);
    //     server.channels.set(payload['id'], {
    //         id: payload['id'],
    //         name: payload['channel_name'],
    //         messages: new Map()
    //     });
    //     setServersObject({servers: serversObject.servers});
    //     setServerObject({server});
    // }
    //
    // function showAddServerOverlay() {
    //     setOverlay({
    //         title: 'Create a server',
    //         description: 'Create a new server or join an existing one',
    //         content: <AddServerOverlay onCreateServer={createServer} onJoinServer={joinServer}/>,
    //         active: true
    //     });
    // }
    //
    // function createServer(name) {
    //     Backend.createServer(socket.id, name)
    //         .then((response) => {
    //             serversObject.servers.set(response.id, {id: response.id, name, channels: new Map()});
    //             setServersObject({servers: serversObject.servers});
    //             setOverlay({active: false});
    //         });
    // }
    //
    // function joinServer(invitation) {
    //     Backend.joinServer(socket.id, invitation)
    //         .then((response) => {
    //             const server = response.server;
    //             server.channels.forEach(channel => {
    //                 channel[1].messages = new Map(channel[1].messages);
    //             });
    //             server.channels = new Map(server.channels);
    //             serversObject.servers.set(server.id, server);
    //             setServersObject({servers: serversObject.servers});
    //             setChannelObject({});
    //             setServerObject({server});
    //             setOverlay({active: false});
    //         });
    // }
    //
    // function showCreateChannelOverlay() {
    //     setOverlay({
    //         title: 'New channel',
    //         description: 'Enter the channel name',
    //         content: <CreateChannelOverlay onCreateChannel={createChannel}/>,
    //         active: true
    //     });
    // }
    //
    // function createChannel(name) {
    //     Backend.createChannel(socket.id, serverObject.server?.id, name)
    //         .then(response => {
    //             const channel = {
    //                 id: response.id,
    //                 name,
    //                 messages: new Map()
    //             };
    //             serversObject.servers.get(serverObject.server?.id).channels.set(response.id, channel);
    //             setServersObject({servers: serversObject.servers});
    //             setChannelObject({channel});
    //             setOverlay(false);
    //         });
    // }
    //
    // function showInvitationOverlay() {
    //     const overlay = {
    //         active: true,
    //         title: 'Invite friends',
    //         description: 'Share this invitation code with your friends'
    //     };
    //     Backend.createInvitation(serverObject.server?.id)
    //         .then(response => {
    //             overlay.content = <InvitationOverlay invitation={response.invitation}/>;
    //             setOverlay(overlay);
    //         });
    // }
    //
    // function deleteServer() {
    //
    // }
    //
    // function sendMessage(text) {
    //     socket.emit('send_message', {
    //             server_id: serverObject.server.id,
    //             channel_id: channelObject.channel.id,
    //             text
    //         },
    //         (payload) => {
    //             serversObject.servers.get(serverObject.server.id)
    //                 .channels.get(channelObject.channel.id)
    //                 .messages.set(payload.id, {
    //                 sender: username,
    //                 text,
    //                 timestamp: payload['timestamp']
    //             });
    //             setServersObject({servers: serversObject.servers});
    //             setChannelObject({channel: channelObject.channel});
    //         }
    //     );
    // }

    // if (!keycloak?.authenticated) return (<Loading/>);

    const onChannelSelect = useCallback((groupId, channelId) => {
        const server = servers.get(channelsPanel.serverId);
        let channel;
        const messages = [];
        if (groupId) {
            channel = server.groups?.get(groupId).channels.get(channelId);
        } else {
            channel = server.channels.get(channelId);
        }
        channel.messages.forEach(message => {
            messages.push({
                id: message.id,
                timestamp: message.timestamp,
                sender: users.get(message.sender).username,
                text: message.text,
            });
        });
        setContentPanel({
            channel: {
                isChannelPrivate: false,
                channelType: channel.type,
                channelName: channel.name
            }
        });
        setMessages(messages);
    }, [channelsPanel]);

    return [(
        <div key={"chat_component"} className="div--theme-dark div--main-container">
            <ServersPanel
                servers={serversPanel}
                // onAddServer={showAddServerOverlay}
                onSelectServer={id => {
                    const server = servers.get(id);
                    setChannelsPanel({
                        serverId: id,
                        serverName: server.name,
                        groups: server.groups,
                        channels: server.channels
                    });
                    const _members = [];
                    server.members.forEach((m => {
                        _members.push(users.get(m));
                    }));
                    setMembers(server.members);
                }}
            />

            <ChannelsPanelContext.Provider value={{onChannelSelect}}>
                <ChannelsPanel
                    serverName={channelsPanel.serverName}
                    groups={channelsPanel.groups}
                    channels={channelsPanel.channels}
                    // onCreateChannel={showCreateChannelOverlay}
                    // onCreateInvitation={showInvitationOverlay}
                    onDeleteServer={id => {
                    }}
                >
                    {
                        channelsPanel.channels.map(channel =>
                            <Channel key={`channel_${channel.id}`} channelKey={channel.id} type={channel.type}
                                     channelName={channel.name}/>
                        ).concat(
                            channelsPanel.groups.map(group =>
                                <Group key={`group_${group.id}`} groupKey={group.id} groupName={group.name}
                                       channels={group.channels}/>
                            )
                        )
                    }
                </ChannelsPanel>
            </ChannelsPanelContext.Provider>

            <ContentPanel
                channel={contentPanel.channel}
                messages={messages}
                membersPanel={members}
            />

            {/*<MessagesPanel*/}
            {/*    messages={channelObject.channel?.messages}*/}
            {/*    onSendMessage={sendMessage}*/}
            {/*/>*/}

            {/*<MembersPanel*/}
            {/*    members={serverObject.server?.members}*/}
            {/*/>*/}

        </div>
    ),
        // (
        // overlay.active ?
        //     <Overlay
        //         key={"overlay_component"}
        //         overlay={overlay}
        //         onClose={() => setOverlay({active: false})}
        //     />
        //     : null
        // )
    ];
}

export default Chat;
