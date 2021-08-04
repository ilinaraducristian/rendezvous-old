import {useCallback, useEffect} from "react";
import {useDrag} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "../../DnDItemTypes";
import mediasoup, {createMediaStreamSource, remoteStream} from "../../mediasoup";
import socket from "../../socketio";
import {selectSubject} from "../../state-management/slices/keycloakSlice";
import {selectUsers} from "../../state-management/slices/serversDataSlice";
import {useAppSelector} from "../../state-management/store";
import ChannelSVG from "../../svg/Channel.svg";
import {VoiceChannel} from "../../types";
import config from "../../config";

type ComponentProps = {
  channel: VoiceChannel
}

const consumers: any[] = [];

function VoiceChannelComponent({channel}: ComponentProps) {

  const subject = useAppSelector(selectSubject);
  const users = useAppSelector(selectUsers);
  // const dispatch = useAppDispatch();

  useEffect(() => {
    const users = channel.users?.filter(user => user.userId !== subject)
        .filter(user => !consumers.find(consumer => user.socketId === consumer.socketId));
    // create consumers
    if (users === undefined) return;
    (async () => {
      for (const user of users) {
        const {transportParameters} = await socket.emitAck("create_transport", {type: "recv"});
        const recvTransport = mediasoup.createRecvTransport(transportParameters);
        recvTransport.on("connect", ({dtlsParameters}, cb) => {
          socket.emit("connect_transport", {type: "recv", dtlsParameters, id: recvTransport.id}, cb);
        });
        const {consumerParameters} = await socket.emitAck("create_consumer", {
          transportId: recvTransport.id,
          socketId: user.socketId,
          rtpCapabilities: mediasoup.rtpCapabilities
        });
        const consumer = await recvTransport.consume(consumerParameters);
        remoteStream.addTrack(consumer.track);
        socket.emit("resume_consumer", {id: consumer.id});
        consumers.push({socketId: user.socketId, consumer});
      }
    })();
  }, [channel.users, subject]);

  const createProducer = useCallback(async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({audio: true});
    const {transportParameters} = await socket.emitAck("create_transport", {type: "send"});
    const sendTransport = mediasoup.createSendTransport(transportParameters);

    sendTransport.on("connect", ({dtlsParameters}, cb) => {
      socket.emit("connect_transport", {type: "send", dtlsParameters, id: sendTransport.id}, cb);
    });

    sendTransport.on("produce", async (parameters, cb) => {
      const {producerId} = await socket.emitAck("create_producer", {
        id: sendTransport.id,
        kind: parameters.kind,
        rtpParameters: parameters.rtpParameters,
        appData: parameters.appData
      });
      cb({id: producerId});
    });
    /*const _producer = */
    await sendTransport.produce({
      track: localStream?.getAudioTracks()[0]
    });

  }, []);

  const selectChannel = useCallback(async () => {
    if (config.offline) return;
    createMediaStreamSource();
    await createProducer();

    const usersInVoiceChannel = await socket.emitAck("join_voice-channel", {
      serverId: channel.serverId,
      channelId: channel.id
    });
    channel.users?.concat(usersInVoiceChannel);
    // dispatch(setChannel(channel));
  }, [channel, createProducer]);

  const [, drag] = useDrag<ChannelDragObject, any, any>({
    type: ItemTypes.CHANNEL,
    item: {id: channel.id, order: channel.order}
  }, [channel.order]);

  return (
      <li ref={drag}>
        <button className="btn btn__channel" type="button" onClick={selectChannel}>
          <ChannelSVG type={channel.type} isPrivate={false} className="svg__text-channel svg__text-channel--private"/>
          <span className="span">{channel.name}</span>
        </button>
        {
          channel.users === undefined ||
          <ul className="list list__voice-channel">
            {
              channel.users
                  .map(_user => users.find(user => user.id === _user.userId))
                  .map((user, i) =>
                      <li className="li" key={`channel_${channel.id}_user${i}`}>{user?.username}</li>
                  )
            }
          </ul>
        }
      </li>
  );

}

export default VoiceChannelComponent;