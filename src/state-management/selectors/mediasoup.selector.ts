import {MediasoupSliceState} from "../slices/mediasoup.slice";

export const selectIsMuted = ({mediasoup}: { mediasoup: MediasoupSliceState }): boolean => mediasoup.isMuted;