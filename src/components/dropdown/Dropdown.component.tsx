import {useCallback, useEffect} from "react";
import {useLazyCreateInvitationQuery} from "../../state-management/apis/http";
import {selectSelectedServer, serversDataSlice} from "../../state-management/slices/serversDataSlice";
import {useAppSelector} from "../../state-management/store";
import CreateChannelOverlayComponent from "../channel/CreateChannelOverlay.component";
import CreateGroupOverlayComponent from "../group/CreateGroupOverlay.component";
import InvitationOverlayComponent from "../overlay/InvitationOverlayComponent";

function DropdownComponent({setIsDropdownShown}: any) {

  const selectedServer = useAppSelector(selectSelectedServer);
  const [fetch, {data: invitation}] = useLazyCreateInvitationQuery();

  const createInvitation = useCallback(async () => {
    if (selectedServer === null) return;
    fetch(selectedServer.id);
  }, [fetch, selectedServer]);

  useEffect(() => {
    if (invitation === undefined) return;
    serversDataSlice.actions.setServer(selectedServer);
    serversDataSlice.actions.setOverlay(<InvitationOverlayComponent invitation={invitation}/>);
    setIsDropdownShown(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitation]);

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