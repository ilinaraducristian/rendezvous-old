import {useCallback, useEffect} from "react";
import {useLazyCreateInvitationQuery} from "../../state-management/apis/socketio";
import {selectSelectedServer, setInvitation, setOverlay} from "../../state-management/slices/serversDataSlice";
import {useAppDispatch, useAppSelector} from "../../state-management/store";
import styled from "styled-components";

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
      <Div>
        <Ul className="list">
          <Li>
            <Button type="button" className="btn" onClick={createInvitation}>
              Invite people
            </Button>
          </Li>
          <Li>
            <Button type="button" className="btn" onClick={showCreateChannelOverlay}>
              Create channel
            </Button>
          </Li>
          <Li>
            <Button type="button" className="btn" onClick={showCreateGroupOverlay}>
              Create group
            </Button>
          </Li>
        </Ul>

      </Div>
  );

}

/* CSS */

const Div = styled.div`
  padding: 1em;
`;

const Ul = styled.ul`
  background-color: var(--color-10th);
  color: var(--color-11th);
  border-radius: 0.5em;
  border: solid var(--color-10th);
  border-width: 0.5em;
`;

const Li = styled.li`
  &:hover {
    background-color: var(--color-12th);
    color: white;
  }
`;

const Button = styled.button`
  color: currentColor;
  width: 100%;
  text-align: start;
`;

/* CSS */

export default DropdownComponent;