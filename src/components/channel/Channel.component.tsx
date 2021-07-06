import {useCallback, useContext, useMemo} from "react";
import {Channel} from "../../types";
import ChannelSVG from "../../svg/Channel.svg";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import config from "../../config";

type ComponentProps = {
  channel: Channel
}

function ChannelComponent({channel}: ComponentProps) {

  const {dispatch} = useContext(GlobalStates);
  const Backend = useBackend();

  const selectChannel = useCallback(async () => {
    if (!config.offline) {
      const messages = await Backend.getMessages(channel.id, 0);
      dispatch({type: Actions.MESSAGES_ADDED, payload: messages});
    }
    dispatch({type: Actions.CHANNEL_SELECTED, payload: {...channel}});
  }, [Backend, channel, dispatch]);

  return useMemo(() => (
      <li>
        <button className="btn btn__channel" type="button" onClick={selectChannel}>
          <ChannelSVG type={channel.type} isPrivate={false} className="svg__text-channel svg__text-channel--private"/>
          <span className="span">{channel.name}</span>
        </button>
      </li>
  ), [channel.name, channel.type, selectChannel]);

}

export default ChannelComponent;