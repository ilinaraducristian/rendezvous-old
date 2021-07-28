import {useCallback, useContext, useEffect, useMemo, useRef} from "react";
import {Channel, ChannelType, User} from "../../types";
import ChannelSVG from "../../svg/Channel.svg";
import {GlobalStates} from "../../state-management/global-state";
import useBackend from "../../hooks/backend.hook";
import config from "../../config";
import {useDrag} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "../../DnDItemTypes";
import Actions from "../../state-management/actions";
import useSocketIo from "../../hooks/socketio.hook";
import {useKeycloak} from "@react-keycloak/web";

type ComponentProps = {
  channel: Channel
}

const consumers: any[] = [];

function ChannelComponent({channel}: ComponentProps) {

  const {state, dispatch} = useContext(GlobalStates);
  const Backend = useBackend();
  const {socket} = useSocketIo();
  const {keycloak} = useKeycloak();

  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (audioRef.current === null) return;
    audioRef.current.srcObject = state.remoteStream;
  }, []);

  useEffect(() => {
    const users = channel.users?.filter(user => user.userId !== keycloak.subject)
        .filter(user => !consumers.find(consumer => user.socketId === consumer.socketId));
    console.log(users);
    // create consumers
    if (users === undefined) return;
    (async () => {
      for (const user of users) {
        const {transportParameters} = await socket.emitAck("create_transport", {type: "recv"});
        const recvTransport = state.device.createRecvTransport(transportParameters);
        recvTransport.on("connect", ({dtlsParameters}, cb) => {
          socket.emit("connect_transport", {type: "recv", dtlsParameters, id: recvTransport.id}, cb);
        });
        const {consumerParameters} = await socket.emitAck("create_consumer", {
          transportId: recvTransport.id,
          socketId: user.socketId,
          rtpCapabilities: state.device.rtpCapabilities
        });
        const consumer = await recvTransport.consume(consumerParameters);
        state.remoteStream.addTrack(consumer.track);
        socket.emit("resume_consumer", {id: consumer.id});
        consumers.push({socketId: user.socketId, consumer});
        console.log(consumers);
      }
    })();
  }, [channel.users]);

  const createProducer = useCallback(async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({audio: true});
    const {transportParameters} = await socket.emitAck("create_transport", {type: "send"});
    const sendTransport = state.device.createSendTransport(transportParameters);
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
    const _producer = await sendTransport.produce({
      track: localStream?.getAudioTracks()[0]
    });

  }, [state.device]);

  const joinVoiceChannel = useCallback(async () => {
    await createProducer();

    const usersInVoiceChannel = await socket.emitAck("join_voice-channel", {
      serverId: channel.serverId,
      channelId: channel.id
    });
    channel.users?.concat(usersInVoiceChannel);
    dispatch({type: Actions.CHANNELS_SET, payload: state.channels.set(channel.id, channel)});
  }, [socket, channel.id]);

  const selectTextChannel = useCallback(async () => {
    if (!config.offline) {
      const messages = await Backend.getMessages(channel.serverId, channel.id, 0);
      dispatch({type: Actions.MESSAGES_ADDED, payload: messages});
    }
    dispatch({type: Actions.CHANNEL_SELECTED, payload: channel.id});
  }, [Backend, channel, dispatch]);

  const selectChannel = useCallback(async () => {
    if (channel.type === ChannelType.Voice) joinVoiceChannel();
    else if (channel.type === ChannelType.Text) selectTextChannel();
  }, [joinVoiceChannel, selectTextChannel, channel.type]);

  const [, drag] = useDrag<ChannelDragObject, any, any>({
    type: ItemTypes.CHANNEL,
    item: {id: channel.id, order: channel.order}
  }, [channel.order]);

  return useMemo(() => (
      <li ref={drag}>
        <audio ref={audioRef} autoPlay={true}/>
        <button className="btn btn__channel" type="button" onClick={selectChannel}>
          <ChannelSVG type={channel.type} isPrivate={false} className="svg__text-channel svg__text-channel--private"/>
          <span className="span">{channel.name}</span>
        </button>
        {
          channel.users === undefined ||
          <ul className="list list__voice-channel">
            {
              channel.users
                  .map(user => (state.users.get(user.userId) as User))
                  .map((user, i) =>
                      <li className="li" key={`voice-channel_${channel.id}_user${i}`}>{user.username}</li>
                  )
            }
          </ul>
        }
      </li>
  ), [channel.name, channel.type, channel.users, drag, selectChannel]);

}

export default ChannelComponent;