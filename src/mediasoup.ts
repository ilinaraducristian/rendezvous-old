import {Device} from "mediasoup-client";
import socket from "./socketio";
import {Consumer} from "mediasoup-client/lib/Consumer";
import {Producer} from "mediasoup-client/lib/Producer";
import {store} from "./state-management/store";
import {setUserIsTalking} from "./state-management/slices/data/data.slice";

const mediasoup = new Device();
const remoteStream = new MediaStream();
let audioContext: AudioContext;
export {audioContext};
const notificationSound = new Audio("/notification.ogg");
let producer: Producer;
const consumers: { socketId: string, consumer: Consumer }[] = [];
let localStream: MediaStream;

/* CHROME FIX FOR AUDIO NOT PLAYING */

let a: HTMLAudioElement | null = new Audio();
a.muted = true;
a.srcObject = remoteStream;
a.addEventListener('canplaythrough', () => {
    a = null;
});

/* CHROME FIX FOR AUDIO NOT PLAYING */

let mediaStreamSourceCreated = false;

function createMediaStreamSource() {
    if (mediaStreamSourceCreated) return;
    if (remoteStream.getAudioTracks().length === 0) return;
    mediaStreamSourceCreated = true;
    audioContext = new AudioContext();
    audioContext.createMediaStreamSource(remoteStream).connect(audioContext.destination);
}

async function createProducer() {
    if (localStream === undefined)
        localStream = await navigator.mediaDevices.getUserMedia({audio: true});
    const {transportParameters} = await socket.emitAck("create_transport", {type: "send"});
    const sendTransport = mediasoup.createSendTransport(transportParameters);

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
    producer = await sendTransport.produce({
        track: localStream?.getAudioTracks()[0]
    });
}

async function createConsumer(socketId: string) {
    const {transportParameters} = await socket.emitAck("create_transport", {type: "recv"});
    const recvTransport = mediasoup.createRecvTransport(transportParameters);
    recvTransport.on("connect", ({dtlsParameters}, cb) => {
        socket.emit("connect_transport", {type: "recv", dtlsParameters, id: recvTransport.id}, cb);
    });
    const {consumerParameters} = await socket.emitAck("create_consumer", {
        transportId: recvTransport.id,
        socketId,
        rtpCapabilities: mediasoup.rtpCapabilities
    });
    const consumer = await recvTransport.consume(consumerParameters);
    consumer.observer.on("pause", () => {
        store.dispatch(setUserIsTalking({socketId, isTalking: false}));
    });
    consumer.observer.on("resume", () => {
        store.dispatch(setUserIsTalking({socketId, isTalking: true}));
    });
    remoteStream.addTrack(consumer.track);
    socket.emit("resume_consumer", {id: consumer.id});
    consumers.push({socketId, consumer});
    createMediaStreamSource();
}

export {
    notificationSound,
    remoteStream,
    producer,
    consumers,
    localStream,
    createMediaStreamSource,
    createProducer,
    createConsumer,
};
export default mediasoup;