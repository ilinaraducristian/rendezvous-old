import {useState} from "react";
import ChannelsListComponent from "../channel/ChannelsList.component";
import ArrowSVG from "../../svg/Arrow.svg";

type ComponentProps = {
  id: number,
  name: string
}

function GroupComponent({id, name}: ComponentProps) {

  const [isCollapsed, setIsExpanded] = useState(true);

  return (
      <li>
        <button className="btn btn__group btn--gray" type="button" onClick={() => setIsExpanded(!isCollapsed)}>
          <ArrowSVG className={"svg__arrow" + (isCollapsed ? " svg__arrow--active" : "")}/>
          <span>{name}</span>
        </button>
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

