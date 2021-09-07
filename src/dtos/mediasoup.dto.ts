import {DtlsParameters, IceCandidate, IceParameters} from "mediasoup-client/lib/Transport";
import {SctpParameters} from "mediasoup-client/lib/SctpParameters";

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

export type CreateProducerRequest = {}

export type CreateConsumerRequest = {
  transportId: string,
  socketId: string
}

export type ResumeConsumerRequest = {
  id: string
}