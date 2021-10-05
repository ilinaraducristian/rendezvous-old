import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Device} from "mediasoup-client";
import {Producer} from "mediasoup-client/lib/Producer";
import {Consumer} from "mediasoup-client/lib/Consumer";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {setUserIsTalking} from "state-management/slices/data/data.slice";
import {
    closeProducer,
    closeTransports,
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
    closeProducer: () => Promise<void>,
    closeTransports: () => Promise<void>,
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
    closeProducer: async () => {
    },
    closeTransports: async () => {
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
            state.isMuted = isMuted;
            updateState();
        };

        initialObject.createTransports = async () => {
            if (state.localStream === undefined)
                state.localStream = await navigator.mediaDevices.getUserMedia({audio: true}).catch();
            if (state.sendTransport !== undefined || state.recvTransport !== undefined) return;
            const {sendTransportParameters, recvTransportParameters} = await createTransports();
            const sendTransport = state.mediasoup.createSendTransport(sendTransportParameters);
            const recvTransport = state.mediasoup.createRecvTransport(recvTransportParameters);

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

            state.sendTransport = sendTransport;
            state.recvTransport = recvTransport;
            updateState();
        };

        initialObject.createProducer = async () => {
            await state.createTransports();
            if (state.localStream === undefined) return;

            state.producer = await state.sendTransport?.produce({
                track: state.localStream.getAudioTracks()[0],
            });

            updateState();
        };

        initialObject.closeProducer = async () => {
            state.producer?.close();
            await closeProducer();
            state.producer = undefined;
            state.localStream = undefined;
            updateState();
        };

        initialObject.closeTransports = async () => {
            state.recvTransport?.close();
            state.sendTransport?.close();
            await closeTransports();
            state.recvTransport = undefined;
            state.recvTransport = undefined;
            updateState();
        };

        initialObject.createConsumers = async (socketIds: string[]) => {
            await state.createTransports();
            const {consumersParameters} = await createConsumers({
                consumers: socketIds.map(socketId => ({
                    socketId,
                    rtpCapabilities: state.mediasoup.rtpCapabilities,
                })),
            });
            await Promise.all(consumersParameters.map(async (consumerParameters, index) => {
                if (state.recvTransport === undefined) return;
                const socketId = socketIds[index];
                const consumer = await state.recvTransport.consume(consumerParameters);
                consumer.observer.on("pause", () => {
                    dispatch(setUserIsTalking({socketId, isTalking: false}));
                });
                consumer.observer.on("resume", () => {
                    dispatch(setUserIsTalking({socketId, isTalking: true}));
                });
                state.remoteStream.addTrack(consumer.track);
                resumeConsumer({id: consumer.id});
                state.consumers = [...state.consumers, {socketId, consumer}];
                if (state.audioContext === undefined) {
                    state.audioContext = new AudioContext();
                    state.audioContext.createMediaStreamSource(state.remoteStream).connect(state.audioContext.destination);
                }
            }));
            updateState();
        };

        socket.on("consumer_pause", (payload) => {
            const found = state.consumers.find(({consumer}) => consumer.id === payload.consumerId);
            if (found === undefined) return;
            found.consumer.pause();
        });

        socket.on("consumer_resume", (payload) => {
            const found = state.consumers.find(({consumer}) => consumer.id === payload.consumerId);
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