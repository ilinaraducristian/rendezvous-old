import {useCallback, useContext} from "react";
import useBackend from "../../hooks/backend.hook";
import {GlobalStates} from "../../state-management/global-state";
import {Server} from "../../types";
import CreateChannelOverlayComponent from "../channel/CreateChannelOverlay.component";
import CreateGroupOverlayComponent from "../group/CreateGroupOverlay.component";
import InvitationOverlayComponent from "../overlay/InvitationOverlayComponent";
import Actions from "../../state-management/actions";

function DropdownComponent({setIsDropdownShown}: any) {

  const Backend = useBackend();
  const {state, dispatch} = useContext(GlobalStates);

  const createInvitation = useCallback(async () => {
    if (state.selectedServer.id === null) return;
    const selectedServer = state.servers.get(state.selectedServer.id) as Server;
    const invitation = await Backend.createInvitation(selectedServer.id);
    dispatch({
      type: Actions.SERVERS_SET,
      payload: state.servers.set(selectedServer.id, selectedServer)
    });
    dispatch({type: Actions.OVERLAY_SET, payload: <InvitationOverlayComponent invitation={invitation}/>});
    setIsDropdownShown(false);
  }, [setIsDropdownShown, Backend, dispatch, state.selectedServer, state.servers]);

  const showCreateChannelOverlay = useCallback(async () => {
    setIsDropdownShown(false);
    dispatch({type: Actions.OVERLAY_SET, payload: <CreateChannelOverlayComponent/>})
  }, [dispatch, setIsDropdownShown])

  const showCreateGroupOverlay = useCallback(async () => {
    setIsDropdownShown(false);
    dispatch({type: Actions.OVERLAY_SET, payload: <CreateGroupOverlayComponent/>})
  }, [dispatch, setIsDropdownShown])

  return (
      <div className="div__dropdown">
        <ul className="list list__dropdown">
          <li className="li__dropdown">
            <button type="button" className="btn btn__dropdown-item" onClick={createInvitation}>Invite people</button>
          </li>
          <li className="li__dropdown">
            <button type="button" className="btn btn__dropdown-item" onClick={showCreateChannelOverlay}>Create channel</button>
          </li>
          <li className="li__dropdown">
            <button type="button" className="btn btn__dropdown-item" onClick={showCreateGroupOverlay}>Create group</button>
          </li>
        </ul>

      </div>
  );

}

export default DropdownComponent;