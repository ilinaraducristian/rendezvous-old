import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Device} from "mediasoup-client";
import {Producer} from "mediasoup-client/lib/Producer";
import {Consumer} from "mediasoup-client/lib/Consumer";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {setUserIsTalking} from "state-management/slices/data/data.slice";
import {useSocket} from "socketio/ReactSocketIOProvider";
import useAsyncEffect from "../util/useAsyncEffect";
import {useKeycloak} from "@react-keycloak/web";
import {selectJoinedChannel, selectSelectedServer} from "state-management/selectors/data.selector";
import {selectJoinedChannelUsers} from "state-management/selectors/channel.selector";

type InitialObjectProperties = {
    mediasoup: Device,
    loaded: boolean,
    localStream?: MediaStream,
    remoteStream: MediaStream,
    producer?: Producer,
    audioContext?: AudioContext,
    consumers: { socketId: string, consumer: Consumer }[],
    isMuted: boolean,
    setMute: (isMuted: boolean) => void,
    createProducer: () => void,
    createConsumer: (socketId: string) => void
};

const initialObject: InitialObjectProperties = {
    mediasoup: new Device(),
    remoteStream: new MediaStream(),
    consumers: [],
    isMuted: true,
    loaded: false,
    setMute: () => {
    },
    createProducer: () => {
    },
    createConsumer: _ => {
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

    useEffect(() => {
        initialObject.setMute = isMuted => {
            initialObject.isMuted = isMuted;
            setState({...initialObject});
        };
        initialObject.createProducer = async () => {
            if (initialObject.localStream === undefined)
                initialObject.localStream = await navigator.mediaDevices.getUserMedia({audio: true});
            const {transportParameters} = await socket.emitAck("create_transport", {type: "send"});
            const sendTransport = initialObject.mediasoup.createSendTransport(transportParameters);

            sendTransport.on("connect", ({dtlsParameters}, cb) => {
                socket.emit("connect_transport", {type: "send", dtlsParameters, id: sendTransport.id}, cb);
            });

            sendTransport.on("produce", (parameters, cb) => {
                socket.emit("create_producer", {
                    id: sendTransport.id,
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData,
                }, cb);
            });
            initialObject.producer = await sendTransport.produce({
                track: initialObject.localStream?.getAudioTracks()[0],
            });
            setState({...initialObject});
        };
        initialObject.createConsumer = async (socketId: string) => {
            const {transportParameters} = await socket.emitAck("create_transport", {type: "recv"});
            const recvTransport = initialObject.mediasoup.createRecvTransport(transportParameters);
            recvTransport.on("connect", ({dtlsParameters}, cb) => {
                socket.emit("connect_transport", {type: "recv", dtlsParameters, id: recvTransport.id}, cb);
            });
            const {consumerParameters} = await socket.emitAck("create_consumer", {
                transportId: recvTransport.id,
                socketId,
                rtpCapabilities: initialObject.mediasoup.rtpCapabilities,
            });
            const consumer = await recvTransport.consume(consumerParameters);
            consumer.observer.on("pause", () => {
                dispatch(setUserIsTalking({socketId, isTalking: false}));
            });
            consumer.observer.on("resume", () => {
                dispatch(setUserIsTalking({socketId, isTalking: true}));
            });
            initialObject.remoteStream.addTrack(consumer.track);
            socket.emit("resume_consumer", {id: consumer.id});
            initialObject.consumers = [...initialObject.consumers, {socketId, consumer}];
            if (initialObject.audioContext === undefined) {
                initialObject.audioContext = new AudioContext();
                initialObject.audioContext.createMediaStreamSource(initialObject.remoteStream).connect(initialObject.audioContext.destination);
            }
            setState({...initialObject});
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
        const {routerRtpCapabilities} = await socket.emitAck(`get_router_capabilities`);
        await state.mediasoup.load({routerRtpCapabilities});
        state.loaded = true;
        setState({...state});
    }, [state, connected, socket]);

    useAsyncEffect(async () => {
        if (!initialized || !keycloak.authenticated) return;
        if (joinedChannel === null) {
            // TODO disconnect
            return;
        }

        const users = joinedChannelUsers.filter(user => user.userId !== keycloak.subject &&
            !state.consumers.find(consumer => user.socketId === consumer.socketId));
        await Promise.all(users.map(user => state.createConsumer(user.socketId)));
    }, [state.consumers, state.createConsumer, joinedChannelUsers, joinedChannel, selectedServer, keycloak, initialized]);

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