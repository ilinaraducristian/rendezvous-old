import {useState} from "react";
import ChannelsListComponent from "components/channel/ChannelsList.component";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useAppSelector} from "state-management/store";
import DropdownComponent from "components/dropdown/Dropdown.component";
import GroupsListComponent from "components/group/GroupsList.component";
import styled from "styled-components";
import {selectSecondPanelBody, selectSelectedServer} from "state-management/selectors/data.selector";
import FriendsListComponent from "../friend/FriendsList.component";
import {SecondPanelBodyTypes} from "../../types/UISelectionModes";

import SecondPanelFooterComponent from "./SecondPanelFooter.component";
import SecondPanelHeaderComponent from "./SecondPanelHeader.component";
import SecondPanelVoiceComponent from "./SecondPanelVoice.component";

function SecondPanelComponent() {

    const [isDropdownShown, setIsDropdownShown] = useState(false);
    const selectedServer = useAppSelector(selectSelectedServer);
    const secondPanelBody = useAppSelector(selectSecondPanelBody);

    return (
        <SecondPanelContainer>
            <SecondPanelHeaderComponent isDropdownShown={isDropdownShown} setIsDropdownShown={setIsDropdownShown}/>
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
            <SecondPanelVoiceComponent/>
            <SecondPanelFooterComponent/>
        </SecondPanelContainer>
    );

}


/* CSS */

const SecondPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-3rd);
  width: 240px;
  min-width: 240px;
  max-width: 240px;
`;

const SecondPanelBody = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

/* CSS */

export default SecondPanelComponent;