import {useCallback, useState} from "react";
import ChannelsListComponent from "./ChannelsList.component";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {selectSelectedServer} from "../../state-management/slices/serversDataSlice";
import {useAppSelector} from "../../state-management/store";
import ArrowXSVG from "../../svg/ArrowX.svg";
import DropdownComponent from "../dropdown/Dropdown.component";
import GroupsListComponent from "../group/GroupsList.component";

function ChannelsPanelComponent() {

  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const selectedServer = useAppSelector(selectSelectedServer);

  const toggleDropdown = useCallback(async () => {
    setIsDropdownShown(!isDropdownShown);
  }, [isDropdownShown, setIsDropdownShown]);

  return (
      <div className="channels-panel">
        <button className="btn btn__server-options" type="button"
                onClick={toggleDropdown}>
          {
            selectedServer === null ||
            <>
            <span
                className="svg__server-options-name">{selectedServer.name}</span>
                <ArrowXSVG collapsed={!isDropdownShown}/>
            </>
          }
        </button>
        {!isDropdownShown || <DropdownComponent setIsDropdownShown={setIsDropdownShown}/>}
        <DndProvider backend={HTML5Backend}>
          <ol className="list list__panel list__channels-panel">
            {selectedServer === null ||
            <>
                <ChannelsListComponent/>
                <GroupsListComponent/>
            </>
            }
          </ol>
        </DndProvider>
      </div>
  );

}

export default ChannelsPanelComponent;