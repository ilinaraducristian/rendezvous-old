import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Device} from "mediasoup-client";
import {Producer} from "mediasoup-client/lib/Producer";
import {Consumer} from "mediasoup-client/lib/Consumer";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {setUserIsTalking} from "state-management/slices/data/data.slice";
import {
    connectTransport,
    createConsumers,
    createProducer,
    createTransports,
    getRouterCapabilities,
    resumeConsumer,
    useSocket,
} from "providers/ReactSocketIO.provider";
import useAsyncEffect from "util/useAsyncEffect";
import {useKeycloak} from "@react-keycloak/web";
import {selectJoinedChannel, selectSelectedServer} from "state-management/selectors/data.selector";
import {selectJoinedChannelUsers} from "state-management/selectors/channel.selector";
import {Transport} from "mediasoup-client/lib/Transport";

type InitialObjectProperties = {
    mediasoup: Device,
    loaded: boolean,
    localStream?: MediaStream,
    remoteStream: MediaStream,
    producer?: Producer,
    sendTransport?: Transport,
    recvTransport?: Transport,
    audioContext?: AudioContext,
    consumers: { socketId: string, consumer: Consumer }[],
    isMuted: boolean,
    setMute: (isMuted: boolean) => void,
    createProducer: () => Promise<void>,
    closeProducer: () => void,
    createConsumers: (socketIds: string[]) => Promise<void>,
    createTransports: () => Promise<void>
};

const initialObject: InitialObjectProperties = {
    mediasoup: new Device(),
    remoteStream: new MediaStream(),
    consumers: [],
    isMuted: true,
    loaded: false,
    setMute: () => {
    },
    createProducer: async () => {
    },
    closeProducer: () => {
    },
    createConsumers: async _ => {
    },
    createTransports: async () => {
    },
};

const MediasoupContext = createContext(initialObject);

function ReactMediasoupProvider({children}: { children: PropsWithChildren<any> }) {

    const [state, setState] = useState<InitialObjectProperties>(initialObject);
    const dispatch = useAppDispatch();
    const {socket, connected} = useSocket();
    const {keycloak, initialized} = useKeycloak();
    const selectedServer = useAppSelector(selectSelectedServer);
    const joinedChannel = useAppSelector(selectJoinedChannel);
    const joinedChannelUsers = useAppSelector(selectJoinedChannelUsers);

    function updateState() {
        setState({...state});
    }

    useEffect(() => {

        initialObject.setMute = isMuted => {
            initialObject.isMuted = isMuted;
            updateState();
        };

        initialObject.createTransports = async () => {
            if (initialObject.sendTransport !== undefined || initialObject.recvTransport !== undefined) return;
            if (initialObject.localStream === undefined)
                initialObject.localStream = await navigator.mediaDevices.getUserMedia({audio: true}).catch();
            const {sendTransportParameters, recvTransportParameters} = await createTransports();
            const sendTransport = initialObject.mediasoup.createSendTransport(sendTransportParameters);
            const recvTransport = initialObject.mediasoup.createRecvTransport(recvTransportParameters);

            sendTransport.on("connect", ({dtlsParameters}, cb) => {
                connectTransport({type: "send", dtlsParameters, id: sendTransport.id}, cb);
            });

            sendTransport.on("produce", (parameters, cb) => {
                createProducer({
                    id: sendTransport.id,
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData,
                }, cb);
            });

            recvTransport.on("connect", ({dtlsParameters}, cb) => {
                connectTransport({type: "recv", dtlsParameters, id: recvTransport.id}, cb);
            });

            initialObject.sendTransport = sendTransport;
            initialObject.recvTransport = recvTransport;
            updateState();
        };

        initialObject.createProducer = async () => {
            await initialObject.createTransports();
            if (initialObject.localStream === undefined) return;

            initialObject.producer = await initialObject.sendTransport?.produce({
                track: initialObject.localStream.getAudioTracks()[0],
            });

            updateState();
        };

        initialObject.closeProducer = () => {
            state.producer?.close();
            state.producer = undefined;
            updateState();
        };

        initialObject.createConsumers = async (socketIds: string[]) => {
            await initialObject.createTransports();
            const {consumersParameters} = await createConsumers({
                consumers: socketIds.map(socketId => ({
                    socketId,
                    rtpCapabilities: initialObject.mediasoup.rtpCapabilities,
                })),
            });
            await Promise.all(consumersParameters.map(async (consumerParameters, index) => {
                if (initialObject.recvTransport === undefined) return;
                const socketId = socketIds[index];
                const consumer = await initialObject.recvTransport.consume(consumerParameters);
                consumer.observer.on("pause", () => {
                    dispatch(setUserIsTalking({socketId, isTalking: false}));
                });
                consumer.observer.on("resume", () => {
                    dispatch(setUserIsTalking({socketId, isTalking: true}));
                });
                initialObject.remoteStream.addTrack(consumer.track);
                resumeConsumer({id: consumer.id});
                initialObject.consumers = [...initialObject.consumers, {socketId, consumer}];
                if (initialObject.audioContext === undefined) {
                    initialObject.audioContext = new AudioContext();
                    initialObject.audioContext.createMediaStreamSource(initialObject.remoteStream).connect(initialObject.audioContext.destination);
                }
            }));
            updateState();
        };

        socket.on("consumer_pause", (payload) => {
            const found = initialObject.consumers.find(({consumer}) => consumer.id === payload.consumerId);
            if (found === undefined) return;
            found.consumer.pause();
        });

        socket.on("consumer_resume", (payload) => {
            const found = initialObject.consumers.find(({consumer}) => consumer.id === payload.consumerId);
            if (found === undefined) return;
            found.consumer.resume();
        });

        setState(initialObject);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useAsyncEffect(async () => {
        if (!connected) return;
        if (state.loaded) return;
        await state.mediasoup.load(await getRouterCapabilities());
        state.loaded = true;
        updateState();
    }, [connected]);

    useAsyncEffect(async () => {
        if (!initialized || !keycloak.authenticated) return;
        if (joinedChannel === null) {
            // TODO disconnect
            state.consumers.forEach(consumer => consumer.consumer.close());
            state.consumers = [];
            updateState();
            return;
        }

        // other users joined
        const users = joinedChannelUsers.filter(user => user.userId !== keycloak.subject);
        const newUsers = users.filter(user => !state.consumers.find(consumer => consumer.socketId === user.socketId));
        await state.createConsumers(newUsers.map(user => user.socketId));
        const {removedUsers, existingUsers} = state.consumers.reduce((prev: any, consumer) => {
            if (users.find(user => user.socketId === consumer.socketId)) {
                prev.existingUsers.push(consumer);
            } else {
                prev.removedUsers.push(consumer);
            }
            return prev;
        }, {removedUsers: [], existingUsers: []});

        removedUsers.forEach((consumer: any) => {
            consumer.consumer.close();
        });
        state.consumers = existingUsers;
        updateState();
    }, [joinedChannelUsers, joinedChannel, selectedServer, keycloak, initialized]);

    return (
        <MediasoupContext.Provider value={state}>
            {children}
        </MediasoupContext.Provider>
    );
}

const useMediasoup = () => useContext(MediasoupContext);
const notificationSound = new Audio("/notification.ogg");

export {useMediasoup, notificationSound};
export default ReactMediasoupProvider;