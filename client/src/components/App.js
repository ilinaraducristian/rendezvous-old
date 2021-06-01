import React, {useCallback, useEffect, useState} from 'react';
import Channel from "./Channel.js";
import Group from "./Group.js";
import Backend from "../Backend.js";
import {SortedMap} from "../SortedMap.js";
import Server from "./Server.js";
import AddServerOverlay from "./AddServerOverlay.js";

let staticData;

function serverMapper(server) {
    return {
        id: server.id,
        name: server.name
    };
}

function channelMapper(channel) {
    return {
        id: channel.id,
        name: channel.name,
    };
}

function messageMapper(message) {
    return {};
}

function App() {

    const [servers, setServers] = useState([]);
    const [channels, setChannels] = useState([]);
    const [groups, setGroups] = useState([]);
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);

    const [overlay, setOverlay] = useState(null);

    useEffect(async () => {
        // staticData = await Backend.getServers();
        staticData = {
            servers: new SortedMap(),
            channels: new SortedMap(),
            messages: new SortedMap()
        };
        staticData.servers.set(1, {
            id: 1,
            name: 'test1',
            channels: new Map([[1, 1], [2, 2], [3, 3]])
        });
    }, []);

    const onServerSelect = useCallback((id) => {
        setMessages([]);
        setChannels(staticData.servers.get(id).channels.map(channelMapper));
    }, []);

    const onChannelSelect = useCallback((id) => {
        setMessages(staticData.channels[id].messages.map(messageMapper));
    }, []);

    useEffect(async () => {
        // get servers and members
        staticData = await Backend.getData();
        setServers(staticData.servers.map(serverMapper));
        // setServers([
        //     <Server id={1} name={'server name'} onServerSelect={onServerSelect}/>
        // ]);
        // setChannels([
        //     <Channel id={1} name="canal 1" onChannelSelect={onChannelSelect}/>,
        //     <Channel id={2} name="canal 2" onChannelSelect={onChannelSelect}/>,
        // ]);
        // setGroups([
        //     <Group name="Group 1">
        //         <Channel id={3} name="channel 3" onChannelSelect={onChannelSelect}/>
        //         <Channel id={4} name="channel 4" onChannelSelect={onChannelSelect}/>
        //     </Group>,
        //     <Group name="Group 2">
        //         <Channel id={5} name="channel 5" onChannelSelect={onChannelSelect}/>
        //         <Channel id={6} name="channel 6" onChannelSelect={onChannelSelect}/>
        //     </Group>,
        //     <Group name="Group 3">
        //         <Channel id={7} name="channel 7" onChannelSelect={onChannelSelect}/>
        //         <Channel id={8} name="channel 8" onChannelSelect={onChannelSelect}/>
        //     </Group>
        // ]);
        // setMessages([
        //     <li className="message-container">
        //         <span className="span--margin">16:00</span>
        //         <span className="span--margin">Display name</span>
        //         <span>Mesaj</span>
        //     </li>
        // ]);
        // setMembers([
        //     <li><span>Display name</span></li>
        // ]);
    }, []);

    async function onCloseOverlay(action, payload) {
        switch (action) {
            case 'joinServer':
                await Backend.joinServer(payload.invitation);
                break;
            case 'createServer':
                await Backend.createServer(payload.name);
                break;
        }
        setOverlay(null);
    }

    const showOverlay = useCallback((type) => {
        switch (type) {
            case 'addServer':
                setOverlay(<AddServerOverlay onClose={onCloseOverlay}/>);
                break;
        }
    }, []);

    return [(
        <div key="main_container" className="container">
            <ul>
                {servers}
                <li>
                    <button onClick={() => showOverlay('addServer')}>+</button>
                </li>
            </ul>

            <ul className="channels-container">
                {channels}
                {groups}
            </ul>
            <ul className="messages-container">
                {messages}
            </ul>
            <ul>
                {members}
            </ul>
        </div>
    ), (
        overlay
    )];

}

export default App;
