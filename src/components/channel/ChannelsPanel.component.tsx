import {GlobalStates} from "../../global-state";
import {useCallback, useContext, useMemo, useState} from "react";
import ArrowXSVG from "../../svg/ArrowX.svg";
import ChannelsListComponent from "./ChannelsList.component";
import DropdownComponent from "../dropdown/Dropdown.component";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import GroupsListComponent from "../group/GroupsList.component";

function ChannelsPanelComponent() {

  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const {state} = useContext(GlobalStates);

  const toggleDropdown = useCallback(async () => {
    setIsDropdownShown(!isDropdownShown);
  }, [isDropdownShown, setIsDropdownShown]);

  return useMemo(() => (
      <div className="channels-panel">
        <button className="btn btn__server-options" type="button"
                onClick={toggleDropdown}>
          {
            state.selectedServer === null ||
            <>
                <span className="svg__server-options-name">{state.selectedServer.name}</span>
                <ArrowXSVG className={"svg__arrow" + (isDropdownShown ? " svg__arrow--active" : "")}/>
            </>
          }
        </button>
        {!isDropdownShown || <DropdownComponent setIsDropdownShown={setIsDropdownShown}/>}
        <DndProvider backend={HTML5Backend}>
          <ol className="list list__panel list__channels-panel">
            {state.selectedServer === null ||
            <>
                <ChannelsListComponent/>
                <GroupsListComponent/>
            </>
            }
          </ol>
        </DndProvider>
      </div>
  ), [isDropdownShown, state.groups, state.selectedServer, toggleDropdown]);

}

export default ChannelsPanelComponent;