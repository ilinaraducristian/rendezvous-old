import {GlobalContext} from "../app/App.component";
import {useCallback} from "react";
import {Channel} from "../../types";

function ChannelComponent({channel}: { channel: Channel }) {

  const consumer = useCallback((
      {
        selectedChannel: [selectedChannel, setSelectedChannel]
      }) => {

    return (
        <li>
          <button className="button" type="button" onClick={() => {
            setSelectedChannel(channel);
          }}>{channel.name}</button>
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