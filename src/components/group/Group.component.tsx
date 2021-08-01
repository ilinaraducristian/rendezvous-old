import {useState} from "react";
import ChannelsListComponent from "../channel/ChannelsList.component";
import ArrowSVG from "../../svg/Arrow.svg";
import CreateChannelOverlayComponent from "../channel/CreateChannelOverlay.component";
import {serversDataSlice} from "../../state-management/slices/serversDataSlice";

type ComponentProps = {
  id: number,
  name: string
}

function GroupComponent({id, name}: ComponentProps) {

  const [isCollapsed, setIsExpanded] = useState(true);

  function createChannel() {
    serversDataSlice.actions.setOverlay(<CreateChannelOverlayComponent groupId={id}/>);
  }

  return (
      <li>
        <div className="div__group">
          <button className="btn btn__group btn--gray" type="button" onClick={() => setIsExpanded(!isCollapsed)}>
            <ArrowSVG className={"svg__arrow" + (isCollapsed ? " svg__arrow--active" : "")}/>
            <span>{name}</span>
          </button>
          <button type="button" className="btn btn__create-channel" onClick={createChannel}>+</button>
        </div>
        {
          isCollapsed ||
          <ol className="list">
              <ChannelsListComponent groupId={id}/>
          </ol>
        }
      </li>
  );

}

export default GroupComponent;

