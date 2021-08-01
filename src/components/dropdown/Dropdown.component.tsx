import {useCallback} from "react";
import {Server} from "../../types";
import CreateChannelOverlayComponent from "../channel/CreateChannelOverlay.component";
import CreateGroupOverlayComponent from "../group/CreateGroupOverlay.component";
import {useAppSelector} from "../../state-management/store";
import {selectSelectedServer, selectServers, serversDataSlice} from "../../state-management/slices/serversDataSlice";
import {useCreateInvitationQuery} from "../../state-management/apis/http";
import InvitationOverlayComponent from "../overlay/InvitationOverlayComponent";

function DropdownComponent({setIsDropdownShown}: any) {

  const selectedServer = useAppSelector(selectSelectedServer);
  const servers = useAppSelector(selectServers);

  const createInvitation = useCallback(async () => {
    if (selectedServer === null) return;
    const _selectedServer = servers.get(selectedServer.id) as Server;
    const {data: invitation} = useCreateInvitationQuery(_selectedServer.id);
    if (invitation === undefined) return;
    serversDataSlice.actions.setServer(_selectedServer);
    serversDataSlice.actions.setOverlay(<InvitationOverlayComponent invitation={invitation}/>);
    setIsDropdownShown(false);
  }, [setIsDropdownShown, selectedServer, servers]);

  const showCreateChannelOverlay = useCallback(async () => {
    setIsDropdownShown(false);
    serversDataSlice.actions.setOverlay(<CreateChannelOverlayComponent/>);
  }, [setIsDropdownShown]);

  const showCreateGroupOverlay = useCallback(async () => {
    setIsDropdownShown(false);
    serversDataSlice.actions.setOverlay(<CreateGroupOverlayComponent/>);
  }, [setIsDropdownShown]);

  return (
      <div className="div__dropdown">
        <ul className="list list__dropdown">
          <li className="li__dropdown">
            <button type="button" className="btn btn__dropdown-item" onClick={createInvitation}>Invite people</button>
          </li>
          <li className="li__dropdown">
            <button type="button" className="btn btn__dropdown-item" onClick={showCreateChannelOverlay}>Create channel
            </button>
          </li>
          <li className="li__dropdown">
            <button type="button" className="btn btn__dropdown-item" onClick={showCreateGroupOverlay}>Create group
            </button>
          </li>
        </ul>

      </div>
  );

}

export default DropdownComponent;