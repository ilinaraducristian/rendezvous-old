import {useCallback} from "react";

import {setInvitation, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import styled from "styled-components";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {OverlayTypes} from "../../types/UISelectionModes";
import {createInvitation, deleteServer} from "../../socketio/ReactSocketIOProvider";

function DropdownComponent({setIsDropdownShown}: any) {

    const selectedServer = useAppSelector(selectSelectedServer);

    const dispatch = useAppDispatch();

    const createInvitationCallback = useCallback(async () => {
        if (selectedServer === undefined) return;
        const invitation = await createInvitation({serverId: selectedServer.id});
        dispatch(setInvitation(invitation));
        dispatch(setOverlay({type: OverlayTypes.InvitationOverlayComponent, payload: {invitation}}));
        setIsDropdownShown(false);
    }, [selectedServer, dispatch, setIsDropdownShown]);

    const showCreateChannelOverlay = useCallback(() => {
        setIsDropdownShown(false);
        dispatch(setOverlay({type: OverlayTypes.CreateChannelOverlayComponent, payload: {groupId: null}}));
    }, [setIsDropdownShown, dispatch]);

    const showCreateGroupOverlay = useCallback(() => {
        setIsDropdownShown(false);
        dispatch(setOverlay({type: OverlayTypes.CreateGroupOverlayComponent}));
    }, [setIsDropdownShown, dispatch]);

    const deleteServerCallback = useCallback(async () => {
        if (selectedServer === undefined) return;
        await deleteServer({serverId: selectedServer.id})
        setIsDropdownShown(false);
    }, [selectedServer, setIsDropdownShown]);

    return (
        <Div>
            <Ul className="list">
                <Li>
                    <Button
                        type="button"
                        className="btn"
                        onClick={createInvitationCallback}
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
                        onClick={deleteServerCallback}
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