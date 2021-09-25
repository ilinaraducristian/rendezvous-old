import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Device} from "mediasoup-client";
import {Producer} from "mediasoup-client/lib/Producer";
import {Consumer} from "mediasoup-client/lib/Consumer";
import socket from "../socketio";
import {useAppDispatch} from "../state-management/store";
import {setUserIsTalking} from "../state-management/slices/data/data.slice";
import {connect} from "../state-management/slices/socketio.slice";

type InitialObjectProperties = {
    mediasoup: Device,
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

const MediasoupContext = createContext(undefined as unknown as InitialObjectProperties);

function ReactMediasoupProvider({children}: { children: PropsWithChildren<any> }) {

    const [state, setState] = useState<InitialObjectProperties>({} as unknown as InitialObjectProperties);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const initialObject: InitialObjectProperties = {
            mediasoup: new Device(),
            remoteStream: new MediaStream(),
            consumers: [],
            isMuted: true,
            setMute: isMuted => {
                initialObject.isMuted = isMuted;
                setState({...initialObject});
            },
            async createProducer() {
                if (this.localStream === undefined)
                    this.localStream = await navigator.mediaDevices.getUserMedia({audio: true});
                const {transportParameters} = await socket.emitAck("create_transport", {type: "send"});
                const sendTransport = this.mediasoup.createSendTransport(transportParameters);

                sendTransport.on("connect", ({dtlsParameters}, cb) => {
                    socket.emit("connect_transport", {type: "send", dtlsParameters, id: sendTransport.id}, cb);
                });

                sendTransport.on("produce", (parameters, cb) => {
                    socket.emit("create_producer", {
                        id: sendTransport.id,
                        kind: parameters.kind,
                        rtpParameters: parameters.rtpParameters,
                        appData: parameters.appData
                    }, cb)
                });
                this.producer = await sendTransport.produce({
                    track: this.localStream?.getAudioTracks()[0]
                });
                setState({...initialObject});
            },
            async createConsumer(socketId: string) {
                const {transportParameters} = await socket.emitAck("create_transport", {type: "recv"});
                const recvTransport = this.mediasoup.createRecvTransport(transportParameters);
                recvTransport.on("connect", ({dtlsParameters}, cb) => {
                    socket.emit("connect_transport", {type: "recv", dtlsParameters, id: recvTransport.id}, cb);
                });
                const {consumerParameters} = await socket.emitAck("create_consumer", {
                    transportId: recvTransport.id,
                    socketId,
                    rtpCapabilities: this.mediasoup.rtpCapabilities
                });
                const consumer = await recvTransport.consume(consumerParameters);
                consumer.observer.on("pause", () => {
                    dispatch(setUserIsTalking({socketId, isTalking: false}));
                });
                consumer.observer.on("resume", () => {
                    dispatch(setUserIsTalking({socketId, isTalking: true}));
                });
                this.remoteStream.addTrack(consumer.track);
                socket.emit("resume_consumer", {id: consumer.id});
                this.consumers = [...this.consumers, {socketId, consumer}];
                if (this.audioContext === undefined) {
                    this.audioContext = new AudioContext();
                    this.audioContext.createMediaStreamSource(this.remoteStream).connect(this.audioContext.destination);
                }
                setState({...initialObject});
            }
        };

        socket.on('consumer_pause', (payload) => {
            const found = initialObject.consumers.find(({consumer}) => consumer.id === payload.consumerId);
            if (found === undefined) return;
            found.consumer.pause();
        });

        socket.on('consumer_resume', (payload) => {
            const found = initialObject.consumers.find(({consumer}) => consumer.id === payload.consumerId);
            if (found === undefined) return;
            found.consumer.resume();
        });

        socket.on("connect", async () => {
            if (initialObject.mediasoup.loaded) return;
            const {routerRtpCapabilities} = await socket.emitAck(`get_router_capabilities`);
            await initialObject.mediasoup.load({routerRtpCapabilities});
            dispatch(connect());
        });
        setState(initialObject);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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