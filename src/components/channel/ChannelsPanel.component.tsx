import {Actions, GlobalStates} from "../../global-state";
import {useCallback, useContext, useMemo, useState} from "react";
import GroupComponent from "../group/Group.component";
import {Group, Server} from "../../types";
import ArrowXSVG from "../../svg/ArrowX.svg";
import ChannelsListComponent from "./ChannelsList.component";
import useBackend from "../../hooks/backend.hook";
import InvitationOverlayComponent from "../overlay/InvitationOverlayComponent";
import DropdownComponent from "../dropdown/Dropdown.component";

function ChannelsPanelComponent() {

  const Backend = useBackend();
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const {state, dispatch} = useContext(GlobalStates);

  const toggleDropdown = useCallback(async () => {
    setIsDropdownShown(!isDropdownShown);
    // const selectedServer = state.selectedServer as Server;
    // const invitation = await Backend.createInvitation(selectedServer.id);
    // dispatch({
    //   type: Actions.SERVERS_SET,
    //   payload: state.servers.set(selectedServer.id, selectedServer).clone()
    // });
    // dispatch({type: Actions.OVERLAY_SET, payload: <InvitationOverlayComponent invitation={invitation} />})
  }, [Backend, dispatch, isDropdownShown, state.selectedServer, state.servers]);

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