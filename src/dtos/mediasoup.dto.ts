import {DtlsParameters, IceCandidate, IceParameters} from "mediasoup-client/lib/Transport";
import {SctpParameters} from "mediasoup-client/lib/SctpParameters";
import {MediaKind, RtpCapabilities, RtpParameters} from "mediasoup-client/lib/RtpParameters";

export type CreateTransportRequest = {
  type: string
}

export type CreateTransportResponse = {
  transportParameters: {
    id: string,
    iceParameters: IceParameters,
    iceCandidates: IceCandidate[],
    dtlsParameters: DtlsParameters,
    sctpParameters: SctpParameters,
  },
}

export type ConnectTransportRequest = {
  type: string,
  id: string
  dtlsParameters: DtlsParameters,
}

export type CreateProducerRequest = {
  id: string,
  kind: MediaKind,
  rtpParameters: RtpParameters,
  appData: any
}

export type CreateConsumerRequest = {
  transportId: string,
  socketId: string,
  rtpCapabilities: RtpCapabilities
}

export type ResumeConsumerRequest = {
  id: string
}