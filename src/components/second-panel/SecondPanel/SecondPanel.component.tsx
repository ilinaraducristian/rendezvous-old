import {useState} from "react";
import ChannelsListComponent from "components/channel/ChannelsList.component";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useAppSelector} from "state-management/store";
import DropdownComponent from "components/dropdown/Dropdown.component";
import GroupsListComponent from "components/group/GroupsList.component";
import {
    selectJoinedChannel,
    selectSecondPanelBody,
    selectSelectedServer,
} from "state-management/selectors/data.selector";
import FriendsListComponent from "components/friend/FriendsList/FriendsList.component";
import {SecondPanelBodyTypes} from "types/UISelectionModes";

import SecondPanelFooterComponent from "components/second-panel/SecondPanelFooter/SecondPanelFooter.component";
import SecondPanelHeaderComponent from "components/second-panel/SecondPanelHeader/SecondPanelHeader.component";
import SecondPanelVoiceComponent from "components/second-panel/SecondPanelVoice/SecondPanelVoice.component";
import styles from "components/second-panel/SecondPanel/SecondPanel.module.css";

function SecondPanelComponent() {

    const [isDropdownShown, setIsDropdownShown] = useState(false);
    const selectedServer = useAppSelector(selectSelectedServer);
    const secondPanelBody = useAppSelector(selectSecondPanelBody);
    const joinedChannel = useAppSelector(selectJoinedChannel);

    return (
        <div className={styles.secondPanelContainer}>
            <SecondPanelHeaderComponent isDropdownShown={isDropdownShown} setIsDropdownShown={setIsDropdownShown}/>
            {!isDropdownShown || <DropdownComponent setIsDropdownShown={setIsDropdownShown}/>}
            <div className={styles.secondPanelBody}>
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
            </div>
            {
                joinedChannel === null ||
                <SecondPanelVoiceComponent/>
            }
            <SecondPanelFooterComponent/>
        </div>
    );

}

export default SecondPanelComponent;