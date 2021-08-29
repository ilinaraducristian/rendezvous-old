import {useState} from "react";
import ChannelsListComponent from "components/channel/ChannelsList.component";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useAppSelector} from "state-management/store";
import DropdownComponent from "components/dropdown/Dropdown.component";
import GroupsListComponent from "components/group/GroupsList.component";
import styled from "styled-components";
import {ArrowXSVG} from "svg/Arrow.svg";
import {
    selectSecondPanelBody,
    selectSecondPanelFooter,
    selectSecondPanelHeader,
    selectSelectedServer
} from "state-management/selectors/data.selector";
import FriendsListComponent from "../friend/FriendsList.component";
import {SecondPanelBodyTypes, SecondPanelFooterTypes, SecondPanelHeaderTypes} from "../../types/UISelectionModes";

function SecondPanelComponent() {

    const [isDropdownShown, setIsDropdownShown] = useState(false);
    const selectedServer = useAppSelector(selectSelectedServer);
    const secondPanelHeader = useAppSelector(selectSecondPanelHeader);
    const secondPanelBody = useAppSelector(selectSecondPanelBody);
    const secondPanelFooter = useAppSelector(selectSecondPanelFooter);

    function toggleDropdown() {
        if (selectedServer === undefined) return;
        setIsDropdownShown(!isDropdownShown);
    }

    return (
        <SecondPanelDiv>
            <SecondPanelHeader>
                {
                    secondPanelHeader !== SecondPanelHeaderTypes.channel || selectedServer === undefined ||
                    <Button className="btn" type="button" onClick={toggleDropdown}>
                        <Span>{selectedServer.name}</Span>
                        <ArrowXSVG isCollapsed={!isDropdownShown}/>
                    </Button>
                }
                {
                    secondPanelHeader !== SecondPanelHeaderTypes.friends ||
                    <Span>Friends</Span>
                }
            </SecondPanelHeader>
            {!isDropdownShown || <DropdownComponent setIsDropdownShown={setIsDropdownShown}/>}
            <SecondPanelBody>
                {
                    secondPanelBody !== SecondPanelBodyTypes.channels ||
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
                }
                {
                    secondPanelBody !== SecondPanelBodyTypes.friends ||
                    <FriendsListComponent/>
                }
            </SecondPanelBody>
            <SecondPanelFooter>
                {
                    secondPanelFooter !== SecondPanelFooterTypes.generic || undefined
                }
            </SecondPanelFooter>
        </SecondPanelDiv>
    );

}


/* CSS */

const SecondPanelFooter = styled.footer``

const SecondPanelBody = styled.div``;

const SecondPanelDiv = styled.div`
  grid-area: second-panel;
  flex-shrink: 0;
  background-color: var(--color-third);
  width: 15em;
`;

const SecondPanelHeader = styled.header`
  //background: none;
  //font-size: 1.5em;
  //text-align: left;
  width: 100%;

  border-style: none;
  box-shadow: var(--small-shadow-bar);
  //display: flex;
  //align-items: center;
  height: 3em;
  //color: var(--color-9th)
`

// const FriendsSpan = styled.span`
//   color: white;
// `;

const Span = styled.span`
  flex-grow: 1;
  color: white;
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

export default SecondPanelComponent;