import {useState} from "react";
import ChannelsListComponent from "components/channels/ChannelsList.component";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useAppSelector} from "state-management/store";
import DropdownComponent from "components/dropdown/Dropdown.component";
import GroupsListComponent from "components/group/GroupsList.component";
import styled from "styled-components";
import {ArrowXSVG} from "svg/Arrow.svg";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import FriendsListComponent from "components/friend/FriendsList.component";

function ChannelsPanelComponent() {

  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const selectedServer = useAppSelector(selectSelectedServer);

  function toggleDropdown() {
    if (selectedServer === undefined) return;
    setIsDropdownShown(!isDropdownShown);
  }

  return (
      <Div>
        <Button className="btn" type="button"
                onClick={toggleDropdown}>
          {
            selectedServer === undefined ?
                <FriendsSpan>Friends</FriendsSpan>
                :
                <>
                  <Span>{selectedServer.name}</Span>
                  <ArrowXSVG isCollapsed={!isDropdownShown}/>
                </>
          }
        </Button>
        {!isDropdownShown || <DropdownComponent setIsDropdownShown={setIsDropdownShown}/>}
        <DndProvider backend={HTML5Backend}>
          <ol className="list">
            {selectedServer === undefined ?
                <FriendsListComponent/>
                :
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

const FriendsSpan = styled.span`
  color: white;
`;

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