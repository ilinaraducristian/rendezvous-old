import {Device} from "mediasoup-client";

const mediasoup = new Device();
const remoteStream = new MediaStream();

const audioContext = new AudioContext();
audioContext.createMediaStreamSource(remoteStream).connect(audioContext.destination);

export {remoteStream};
export default mediasoup;