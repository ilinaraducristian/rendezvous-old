import {useCallback} from "react";
import {setInvitation, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {OverlayTypes} from "types/UISelectionModes";
import {createInvitation, deleteServer} from "providers/socketio";
import styles from "./Dropdown.module.css";
import ButtonComponent from "components/ButtonComponent";
import checkPermission from "../../util/check-permission";
import keycloak from "keycloak";

function DropdownComponent({setIsDropdownShown}: any) {

    const dispatch = useAppDispatch();
    const selectedServer = useAppSelector(selectSelectedServer);

    const createInvitationCallback = useCallback(async () => {
        if (checkPermission(selectedServer, "createInvitation") === undefined) return;
        const {invitation} = await createInvitation({serverId: selectedServer?.id ?? 0});
        dispatch(setInvitation(invitation));
        dispatch(setOverlay({type: OverlayTypes.InvitationOverlayComponent, payload: {invitation}}));
        setIsDropdownShown(false);
    }, [selectedServer, dispatch, setIsDropdownShown, keycloak]);

    const showCreateChannelOverlay = useCallback(() => {
        if (checkPermission(selectedServer, "createChannels") === undefined) return;
        dispatch(setOverlay({type: OverlayTypes.CreateChannelOverlayComponent, payload: {groupId: null}}));
    }, [dispatch, selectedServer, keycloak]);

    const showCreateGroupOverlay = useCallback(() => {
        if (checkPermission(selectedServer, "createGroups") === undefined) return;
        dispatch(setOverlay({type: OverlayTypes.CreateGroupOverlayComponent}));
    }, [dispatch, keycloak, selectedServer]);

    const deleteServerCallback = useCallback(async () => {
        if (checkPermission(selectedServer, "deleteServer") === undefined) return;
        await deleteServer({serverId: selectedServer?.id ?? -1});
        setIsDropdownShown(false);
    }, [selectedServer, setIsDropdownShown, keycloak]);

    const showServerSettings = useCallback(() => {
        dispatch(setOverlay({type: OverlayTypes.ServerSettingsComponent}));
    }, [dispatch]);

    return (
        <div className={styles.dropdownContainer}>
            <ul className="list">
                <li>
                    <ButtonComponent onClick={createInvitationCallback}>
                        Invite people
                    </ButtonComponent>
                </li>
                <li>
                    <ButtonComponent onClick={showCreateChannelOverlay}>
                        Create channel
                    </ButtonComponent>
                </li>
                <li>
                    <ButtonComponent onClick={showCreateGroupOverlay}>
                        Create group
                    </ButtonComponent>
                </li>
                <li>
                    <ButtonComponent onClick={deleteServerCallback}>
                        Delete server
                    </ButtonComponent>
                </li>
                <li>
                    <ButtonComponent onClick={showServerSettings}>
                        Server Settings
                    </ButtonComponent>
                </li>
            </ul>
        </div>
    );

}

export default DropdownComponent;