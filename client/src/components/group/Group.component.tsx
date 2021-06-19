import {Channel} from "../../types";
import {useState} from "react";
import ChannelComponent from "../channel/Channel.component";
import SortedMap from "../../util/SortedMap";

function GroupComponent({name, channels}: { name: string, channels: SortedMap<Channel> }) {

  const [isCollapsed, setIsExpanded] = useState(true);

  return (
      <li>
        <button className="button" type="button" onClick={() => setIsExpanded(!isCollapsed)}>{name}</button>
        <ol className="list">
          {
            isCollapsed ||
            channels.map(channel => (
                <ChannelComponent key={`channel_${channel.id}`} channel={channel}/>
            ))
          }
        </ol>
      </li>
  );

}

export default GroupComponent;

