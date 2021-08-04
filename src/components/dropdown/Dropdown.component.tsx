import {useCallback, useEffect} from "react";
import {useLazyCreateInvitationQuery} from "../../state-management/apis/socketio";
import {selectSelectedServer, setInvitation, setOverlay} from "../../state-management/slices/serversDataSlice";
import {useAppDispatch, useAppSelector} from "../../state-management/store";

function DropdownComponent({setIsDropdownShown}: any) {

  const selectedServer = useAppSelector(selectSelectedServer);
  const [fetch, {data: invitation}] = useLazyCreateInvitationQuery();
  const dispatch = useAppDispatch();

  const createInvitation = useCallback(async () => {
    if (selectedServer === undefined) return;
    fetch(selectedServer.id);
  }, [fetch, selectedServer]);

  useEffect(() => {
    if (invitation === undefined) return;
    dispatch(setInvitation(invitation));
    dispatch(setOverlay({type: "InvitationOverlayComponent", payload: {invitation}}));
    setIsDropdownShown(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitation]);

  const showCreateChannelOverlay = useCallback(async () => {
    setIsDropdownShown(false);
    dispatch(setOverlay({type: "CreateChannelOverlayComponent", payload: {groupId: null}}));
  }, [setIsDropdownShown, dispatch]);

  const showCreateGroupOverlay = useCallback(async () => {
    setIsDropdownShown(false);
    dispatch(setOverlay({type: "CreateGroupOverlayComponent"}));
  }, [setIsDropdownShown, dispatch]);

  return (
      <div className="div__dropdown">
        <ul className="list list__dropdown">
          <li className="li__dropdown">
            <button type="button" className="btn btn__dropdown-item" onClick={createInvitation}>
              Invite people
            </button>
          </li>
          <li className="li__dropdown">
            <button type="button" className="btn btn__dropdown-item" onClick={showCreateChannelOverlay}>
              Create channel
            </button>
          </li>
          <li className="li__dropdown">
            <button type="button" className="btn btn__dropdown-item" onClick={showCreateGroupOverlay}>
              Create group
            </button>
          </li>
        </ul>

      </div>
  );

}

export default DropdownComponent;