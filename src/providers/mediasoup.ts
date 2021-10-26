import {store} from "state-management/store";
import {setUserIsTalking} from "state-management/slices/data/data.slice";
import {
    closeProducer as socketioCloseProducer,
    closeTransports as socketioCloseTransports,
    connectTransport as socketioConnectTransport,
    createConsumers as socketioCreateConsumers,
    createProducer as socketIOCreateProducer,
    createTransports as socketioCreateTransports,
    resumeConsumer as socketioResumeConsumer,
} from "providers/socketio";
import {Producer} from "mediasoup-client/lib/Producer";
import {Device} from "mediasoup-client";
import {Transport} from "mediasoup-client/lib/Transport";
import {Consumer} from "mediasoup-client/lib/Consumer";

const mediasoup = new Device();
export let localStream: MediaStream | undefined;
export let audioContext: AudioContext | undefined;
export let sendTransport: Transport | undefined;
export let recvTransport: Transport | undefined;
export let producer: Producer | undefined;
export let remoteStream: MediaStream = new MediaStream();
export let consumers: { socketId: string, consumer: Consumer }[] = [];

async function createTransports() {
    if (localStream === undefined)
        localStream = await navigator.mediaDevices.getUserMedia({audio: true}).catch();
    if (sendTransport !== undefined || recvTransport !== undefined) return;
    const {sendTransportParameters, recvTransportParameters} = await socketioCreateTransports();
    sendTransport = mediasoup.createSendTransport(sendTransportParameters);
    recvTransport = mediasoup.createRecvTransport(recvTransportParameters);

    sendTransport.on("connect", ({dtlsParameters}, cb) => {
        socketioConnectTransport({type: "send", dtlsParameters, id: sendTransport?.id ?? "-1"}, cb);
    });

    sendTransport.on("produce", (parameters, cb) => {
        socketIOCreateProducer({
            id: sendTransport?.id ?? "-1",
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
        }, cb);
    });

    recvTransport.on("connect", ({dtlsParameters}, cb) => {
        socketioConnectTransport({type: "recv", dtlsParameters, id: recvTransport?.id ?? "-1"}, cb);
    });

}

export async function createProducer() {
    await createTransports();
    if (localStream === undefined) return;

    producer = await sendTransport?.produce({
        track: localStream.getAudioTracks()[0],
    });
}

export async function closeProducer() {
    producer?.close();
    await socketioCloseProducer();
    producer = undefined;
    localStream = undefined;
}

export async function closeTransports() {
    recvTransport?.close();
    sendTransport?.close();
    await socketioCloseTransports();
    recvTransport = undefined;
    recvTransport = undefined;
}

export async function createConsumers(socketIds: string[]) {
    await createTransports();
    const {consumersParameters} = await socketioCreateConsumers({
        consumers: socketIds.map(socketId => ({
            socketId,
            rtpCapabilities: mediasoup.rtpCapabilities,
        })),
    });
    await Promise.all(consumersParameters.map(async (consumerParameters, index) => {
        if (recvTransport === undefined) return;
        const socketId = socketIds[index];
        const consumer = await recvTransport.consume(consumerParameters);
        consumer.observer.on("pause", () => {
            store.dispatch(setUserIsTalking({socketId, isTalking: false}));
        });
        consumer.observer.on("resume", () => {
            store.dispatch(setUserIsTalking({socketId, isTalking: true}));
        });
        remoteStream?.addTrack(consumer.track);
        await socketioResumeConsumer({id: consumer.id});
        consumers = [...consumers, {socketId, consumer}];
        if (audioContext === undefined) {
            audioContext = new AudioContext();
            audioContext.createMediaStreamSource(remoteStream).connect(audioContext.destination);
        }
    }));

}

export const notificationSound = new Audio("/notification.ogg");
export default mediasoup;
// if (!initialized || !keycloak.authenticated) return;
// if (joinedChannel === null) {
//     consumers.forEach(consumer => consumer.consumer.close());
//     consumers = [];
//     updateState();
//     return;
// }
//
// // other users joined
// const users = joinedChannelUsers.filter(user => user.userId !== keycloak.subject);
// const newUsers = users.filter(user => !consumers.find(consumer => consumer.socketId === user.socketId));
// await createConsumers(newUsers.map(user => user.socketId));
// const {removedUsers, existingUsers} = consumers.reduce((prev: any, consumer) => {
//     if (users.find(user => user.socketId === consumer.socketId)) {
//         prev.existingUsers.push(consumer);
//     } else {
//         prev.removedUsers.push(consumer);
//     }
//     return prev;
// }, {removedUsers: [], existingUsers: []});
//
// removedUsers.forEach((consumer: any) => {
//     consumer.consumer.close();
// });
// consumers = existingUsers;