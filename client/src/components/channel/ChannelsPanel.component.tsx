import {GlobalStates} from "../../global-state";
import {useCallback, useContext, useMemo, useState} from "react";
import GroupComponent from "../group/Group.component";
import {Group} from "../../types";
import ArrowXSVG from "../../svg/ArrowX.svg";
import ChannelsListComponent from "./ChannelsList.component";

function ChannelsPanelComponent() {

  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const {state} = useContext(GlobalStates);

  const toggleDropdown = useCallback(() => {
    setIsDropdownShown(!isDropdownShown);
  }, [isDropdownShown]);

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
        <ol className="list list__panel list__channels-panel">
          {state.selectedServer === null ||
          <>
              <ChannelsListComponent/>
            {
              state.groups.filter((group: Group) => group.serverId === state.selectedServer?.id)
                  .map((group: Group) =>
                      <GroupComponent key={`group_${group.id}`} id={group.id} name={group.name}/>
                  )
            }
          </>
          }
        </ol>
      </div>
  ), [isDropdownShown, state.groups, state.selectedServer, toggleDropdown]);

}

export default ChannelsPanelComponent;