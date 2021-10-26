import {useCallback} from "react";
import {setInvitation, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {OverlayTypes} from "types/UISelectionModes";
import {createInvitation, deleteServer} from "providers/socketio";
import styles from "./Dropdown.module.css";
import ButtonComponent from "components/ButtonComponent";
import {useKeycloak} from "@react-keycloak/web";
import checkPermission from "../../util/check-permission";

function DropdownComponent({setIsDropdownShown}: any) {

    const dispatch = useAppDispatch();
    const selectedServer = useAppSelector(selectSelectedServer);
    const {initialized, keycloak} = useKeycloak();

    const createInvitationCallback = useCallback(async () => {
        if (checkPermission(initialized, keycloak, selectedServer, 'createInvitation') === undefined) return;
        const {invitation} = await createInvitation({serverId: selectedServer?.id ?? 0});
        dispatch(setInvitation(invitation));
        dispatch(setOverlay({type: OverlayTypes.InvitationOverlayComponent, payload: {invitation}}));
        setIsDropdownShown(false);
    }, [selectedServer, dispatch, setIsDropdownShown, initialized, keycloak]);

    const showCreateChannelOverlay = useCallback(() => {
        if (checkPermission(initialized, keycloak, selectedServer, 'createChannels') === undefined) return;
        dispatch(setOverlay({type: OverlayTypes.CreateChannelOverlayComponent, payload: {groupId: null}}));
    }, [dispatch, initialized, selectedServer, keycloak]);

    const showCreateGroupOverlay = useCallback(() => {
        if (checkPermission(initialized, keycloak, selectedServer, 'createGroups') === undefined) return;
        dispatch(setOverlay({type: OverlayTypes.CreateGroupOverlayComponent}));
    }, [dispatch, initialized, keycloak, selectedServer]);

    const deleteServerCallback = useCallback(async () => {
        if (checkPermission(initialized, keycloak, selectedServer, 'deleteServer') === undefined) return;
        await deleteServer({serverId: selectedServer?.id ?? -1});
        setIsDropdownShown(false);
    }, [selectedServer, setIsDropdownShown, initialized, keycloak]);

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