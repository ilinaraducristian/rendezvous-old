import {useState} from "react";
import ChannelsListComponent from "components/channel/ChannelsList.component";
import {ArrowSVG} from "svg/Arrow/Arrow.svg";
import {setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import styled from "styled-components";
import {OverlayTypes} from "types/UISelectionModes";

type ComponentProps = {
  id: number,
  name: string
}

function GroupComponent({id, name}: ComponentProps) {

  const [isCollapsed, setIsExpanded] = useState(true);
  const dispatch = useAppDispatch();


  function createChannel() {
    dispatch(setOverlay({type: OverlayTypes.CreateChannelOverlayComponent, payload: {groupId: id}}));
  }

  return (
      <li>
        <Div>
          <Button className="btn" type="button" onClick={() => setIsExpanded(!isCollapsed)}>
            <ArrowSVG isCollapsed={isCollapsed}/>
            <span>{name}</span>
          </Button>
          <ButtonCreateChannel type="button" className="btn" onClick={createChannel}>+</ButtonCreateChannel>
        </Div>
        {
          isCollapsed ||
          <ol className="list">
              <ChannelsListComponent groupId={id}/>
          </ol>
        }
      </li>
  );

}

/* CSS */

const Button = styled.button`
  display: flex;
  flex-grow: 1;
  color: var(--color-9th)
`;

const Div = styled.div`
  display: flex;
  /*flex-direction: column;*/
  align-items: center;
`;
const ButtonCreateChannel = styled.button`
  font-size: 1.5em;
`;

/* CSS */

export default GroupComponent;

