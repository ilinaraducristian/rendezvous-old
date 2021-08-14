import {Device} from "mediasoup-client";

const mediasoup = new Device();
const remoteStream = new MediaStream();
const audioContext = new AudioContext();
const notificationSound = new Audio("/notification.ogg");

let created = false;

function createMediaStreamSource() {
  if (created) return;
  if (remoteStream.getAudioTracks().length === 0) return;
  created = true;
  audioContext.createMediaStreamSource(remoteStream).connect(audioContext.destination);
}

export {notificationSound, remoteStream, createMediaStreamSource};
export default mediasoup;