import {GlobalContext} from "../app/App.component";
import {useCallback} from "react";
import {Channel} from "../../types";
import ChannelSVG from "../../svg/Channel.svg";

type Props = {
  channel: Channel
}

function ChannelComponent({channel}: Props) {

  const consumer = useCallback(props => {

    return (
        <li>
          <button className="btn btn__channel" type="button" onClick={() => {
            props.selectedChannel[1](channel);
          }}>
            <ChannelSVG type={channel.type} isPrivate={false} className="svg__text-channel svg__text-channel--private"/>
            <span className="span__channel-name">{channel.name}</span>
          </button>
        </li>
    );

  }, [channel]);

  return (
      <GlobalContext.Consumer>
        {consumer}
      </GlobalContext.Consumer>
  );

}

export default ChannelComponent;