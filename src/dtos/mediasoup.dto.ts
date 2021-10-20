import {DtlsParameters, IceCandidate, IceParameters} from "mediasoup-client/lib/Transport";
import {SctpParameters} from "mediasoup-client/lib/SctpParameters";
import {MediaKind, RtpCapabilities, RtpParameters} from "mediasoup-client/lib/RtpParameters";

export type CreateTransportRequest = {
    type: string
}

export type TransportParameters = {
    id: string,
    iceParameters: IceParameters,
    iceCandidates: IceCandidate[],
    dtlsParameters: DtlsParameters,
    sctpParameters: SctpParameters,
}

export type CreateTransportResponse = {
    sendTransportParameters: TransportParameters,
    recvTransportParameters: TransportParameters
}

export type ConnectTransportRequest = {
    type: string,
    dtlsParameters: DtlsParameters,
    id: string
}

export type CreateProducerRequest = {
    id: string,
    kind: MediaKind,
    rtpParameters: RtpParameters,
    appData: any
}

export type CreateConsumerRequest = {
    consumers: {
        socketId: string,
        rtpCapabilities: RtpCapabilities
    }[]
}

export type CreateConsumersResponse = {
    consumersParameters: { id: string, producerId: string, rtpParameters: RtpParameters, kind: MediaKind, appData: any }[]
}

export type ResumeConsumerRequest = {
    id: string
}

export type RouterCapabilitiesResponse = { routerRtpCapabilities: RtpCapabilities };