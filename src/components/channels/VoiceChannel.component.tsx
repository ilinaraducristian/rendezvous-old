import {useCallback, useRef} from "react";
import {useDrag} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "DnDItemTypes";
import mediasoup from "mediasoup";
import socket from "socketio";
import {joinVoiceChannel} from "state-management/slices/serversSlice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import ChannelSVG from "svg/Channel.svg";
import config from "config";
import {VoiceChannel} from "types/Channel";
import styled from "styled-components";
import ChannelButtonComponent from "components/channels/ChannelButton.component";
import {selectUsers} from "state-management/selectors";

type ComponentProps = {
  channel: VoiceChannel
}

function VoiceChannelComponent({channel}: ComponentProps) {

  const users = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();
  const joined = useRef(false);

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

  const selectChannel = useCallback(() => {
    if (config.offline) return;
    if (joined.current) return;
    joined.current = true;
    dispatch(joinVoiceChannel(channel.id));
    // await createProducer();

    // const usersInVoiceChannel = await socket.emitAck("join_voice-channel", {
    //   serverId: channel.serverId,
    //   channelId: channel.id
    // });
    // dispatch(addChannelUsers(usersInVoiceChannel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined.current, channel, createProducer]);

  const [, drag] = useDrag<ChannelDragObject, any, any>({
    type: ItemTypes.CHANNEL,
    item: {id: channel.id, order: channel.order, groupId: channel.groupId}
  }, [channel.order]);

  return (
      <li ref={drag}>
        <ChannelButtonComponent className="btn" type="button" onClick={selectChannel}>
          <ChannelSVG type={channel.type} isPrivate={false}/>
          <span className="span">{channel.name}</span>
        </ChannelButtonComponent>
        {
          <Ul className="list">
            {
              channel.users
                  .map(_user => users.find(user => user.id === _user.userId))
                  .filter(user => user !== undefined)
                  .map((user, i) =>
                      <li className="li" key={`channel_${channel.id}_user${i}`}>{user?.username}</li>
                  )
            }
          </Ul>
        }
      </li>
  );

}

/* CSS */

const Ul = styled.ul`
  color: white;
`;

/* CSS */

export default VoiceChannelComponent;