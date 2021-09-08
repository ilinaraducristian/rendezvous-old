import {useCallback, useEffect} from "react";
import {useLazyCreateInvitationQuery, useLazyDeleteServerQuery} from "state-management/apis/socketio";
import {setInvitation, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import styled from "styled-components";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {OverlayTypes} from "../../types/UISelectionModes";

function DropdownComponent({setIsDropdownShown}: any) {

    const selectedServer = useAppSelector(selectSelectedServer);
    const [fetch, {data: invitation, isSuccess: isSuccessCreateInvitation}] = useLazyCreateInvitationQuery();
    const [fetchDeleteServer, {isSuccess: isSuccessDeleteServer}] = useLazyDeleteServerQuery();
    const dispatch = useAppDispatch();

    const createInvitation = useCallback(() => {
        if (selectedServer === undefined) return;
        fetch({serverId: selectedServer.id});
    }, [fetch, selectedServer]);

    useEffect(() => {
        if (!isSuccessCreateInvitation && invitation === undefined) return;
        dispatch(setInvitation(invitation));
        dispatch(setOverlay({type: OverlayTypes.InvitationOverlayComponent, payload: {invitation}}));
        setIsDropdownShown(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invitation, isSuccessCreateInvitation]);

    const showCreateChannelOverlay = useCallback(() => {
        setIsDropdownShown(false);
        dispatch(setOverlay({type: OverlayTypes.CreateChannelOverlayComponent, payload: {groupId: null}}));
    }, [setIsDropdownShown, dispatch]);

    const showCreateGroupOverlay = useCallback(() => {
        setIsDropdownShown(false);
        dispatch(setOverlay({type: OverlayTypes.CreateGroupOverlayComponent}));
    }, [setIsDropdownShown, dispatch]);

    const deleteServer = useCallback(() => {
        if (selectedServer === undefined) return;
        fetchDeleteServer({serverId: selectedServer.id})
    }, [fetchDeleteServer, selectedServer]);

    useEffect(() => {
        if (!isSuccessDeleteServer) return;
        setIsDropdownShown(false);
    }, [isSuccessDeleteServer, setIsDropdownShown])

    return (
        <Div>
            <Ul className="list">
                <Li>
                    <Button
                        type="button"
                        className="btn"
                        onClick={createInvitation}
                    >
                        Invite people
                    </Button>
                </Li>
                <Li>
                    <Button
                        type="button"
                        className="btn"
                        onClick={showCreateChannelOverlay}
                    >
                        Create channel
                    </Button>
                </Li>
                <Li>
                    <Button
                        type="button"
                        className="btn"
                        onClick={showCreateGroupOverlay}
                    >
                        Create group
                    </Button>
                </Li>
                <Li>
                    <Button
                        type="button"
                        className="btn"
                        onClick={deleteServer}
                    >
                        Delete server
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