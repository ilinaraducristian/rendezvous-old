import {useState} from "react";
import ChannelsListComponent from "./ChannelsList.component";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {selectSelectedServer} from "../../state-management/slices/serversSlice";
import {useAppSelector} from "../../state-management/store";
import DropdownComponent from "../dropdown/Dropdown.component";
import GroupsListComponent from "../group/GroupsList.component";
import styled from "styled-components";
import {ArrowXSVG} from "../../svg/Arrow.svg";

function ChannelsPanelComponent() {

  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const selectedServer = useAppSelector(selectSelectedServer);

  function toggleDropdown() {
    setIsDropdownShown(!isDropdownShown);
  }

  return (
      <Div>
        <Button className="btn" type="button"
                onClick={toggleDropdown}>
          {
            selectedServer === undefined ||
            <>
                <Span>{selectedServer.name}</Span>
                <ArrowXSVG isCollapsed={!isDropdownShown}/>
            </>
          }
        </Button>
        {!isDropdownShown || <DropdownComponent setIsDropdownShown={setIsDropdownShown}/>}
        <DndProvider backend={HTML5Backend}>
          <ol className="list">
            {selectedServer === undefined ||
            <>
                <ChannelsListComponent/>
                <GroupsListComponent/>
            </>
            }
          </ol>
        </DndProvider>
      </Div>
  );

}

/* CSS */

const Div = styled.div`
  flex-shrink: 0;
  background-color: var(--color-third);
  width: 15em;
`;

const Span = styled.span`
  flex-grow: 1;
`;

const Button = styled.button`
  background: none;
  font-size: 1.5em;
  text-align: left;
  width: 100%;

  border-style: none;
  box-shadow: var(--small-shadow-bar);
  display: flex;
  align-items: center;
  height: 2em;
  color: var(--color-9th)
`;

/* CSS */

export default ChannelsPanelComponent;