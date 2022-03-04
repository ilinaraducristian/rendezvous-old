import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/Transport";
import { fetchAuthMediasoupJson, mediasoup } from "./api";
import config from "./config";

class MediasoupInstance {
  device?: Device;
  audioContext = new AudioContext();
  localStream?: MediaStream;
//   routerRtpCapabilities?: RtpCapabilities;
  sendWebRtcTransport?: Transport;
  receiveWebRtcTransport?: Transport;

  async joinChannel() {

  }

  // async connectToChannel(serverId: string, groupId: string, channelId: string) {
  //   // this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //   this.device = new Device();
  //   const {routerRtpCapabilities, channels} = mediasoup.getData()
  //   const { sendWebRtcTransport, receiveWebRtcTransport } = await mediasoup.createTransports();

  //   // this.routerRtpCapabilities = routerRtpCapabilities;
  //   this.sendWebRtcTransport = sendWebRtcTransport;
  //   this.receiveWebRtcTransport = receiveWebRtcTransport;

  //   this.device.load(routerRtpCapabilities);
  //   const sendTransport = this.device.createSendTransport(sendWebRtcTransport);
  //   const receiveTransport = this.device.createRecvTransport(receiveWebRtcTransport);

  //   sendTransport.on("connect", async ({dtlsParameters}, cb) => {
  //       await mediasoup.connectTransport( "send", dtlsParameters);
  //       cb();
  //   });

  //   sendTransport.on("produce", async (parameters, cb) => {
  //       const {id} = await mediasoup.createProducer({
  //           id: sendTransport.id,
  //           kind: parameters.kind,
  //           rtpParameters: parameters.rtpParameters,
  //       });
  //       cb(id);
  //   });
    
  //   receiveTransport.on("connect", async ({dtlsParameters}, cb) => {
  //     await mediasoup.connectTransport("receive", dtlsParameters);
  //     cb();
  // });

  // const parameters = await mediasoup.createConsumer(producer.id, this.device.rtpCapabilities);

  //   if (this.audioContext.state === "closed") {
  //     const mediaStream = new MediaStream();
  //     const source = this.audioContext.createMediaStreamSource(mediaStream);
  //     source.connect(this.audioContext.destination);
  //   }
  // }
}

export default new MediasoupInstance();
