import {useState} from "react";
import ChannelsListComponent from "components/channel/ChannelsList.component";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useAppDispatch, useAppSelector} from "state-management/store";
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
import FriendsListComponent from "./friend/FriendsList.component";
import {SecondPanelBodyTypes, SecondPanelFooterTypes, SecondPanelHeaderTypes} from "../types/UISelectionModes";
import AvatarSVG from "../svg/Avatar.svg";
import MicrophoneSVG from "../svg/Microphone.svg";
import HeadphonesSVG from "../svg/Headphones.svg";
import GearSVG from "../svg/Gear.svg";
import {showSettings} from "../state-management/slices/data/data.slice";

function SecondPanelComponent() {

    const [isDropdownShown, setIsDropdownShown] = useState(false);
    const selectedServer = useAppSelector(selectSelectedServer);
    const secondPanelHeader = useAppSelector(selectSecondPanelHeader);
    const secondPanelBody = useAppSelector(selectSecondPanelBody);
    const secondPanelFooter = useAppSelector(selectSecondPanelFooter);
    const dispatch = useAppDispatch();

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
                    secondPanelFooter !== SecondPanelFooterTypes.generic ||
                    <>
                        <AvatarSVG/>
                        <Username> User1 </Username>
                        <MicrophoneSVG/>
                        <HeadphonesSVG/>
                        <button type="button" className="btn"
                                onClick={() => dispatch(showSettings(undefined))}
                        >
                            <GearSVG/>
                        </button>
                    </>
                }
            </SecondPanelFooter>
        </SecondPanelDiv>
    );

}


/* CSS */

const Username = styled.span`
  color: white;
  flex-grow: 1;
`

const SecondPanelFooter = styled.footer`
  color: white;
  background-color: var(--color-13th);
  height: 3.25em;
  display: flex;
  align-items: center;
`

const SecondPanelBody = styled.div`
  flex-grow: 1;
`;

const SecondPanelDiv = styled.div`
  display: flex;
  flex-direction: column;
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