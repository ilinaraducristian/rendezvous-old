import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "state-management/store";
import config from "config";
import {processedServerData} from "mock-data";
import {initializeBackend} from "state-management/slices/data/data.slice";
import FirstPanelComponent from "components/first-panel/FirstPanel/FirstPanel.component";
import SecondPanelComponent from "components/second-panel/SecondPanel/SecondPanel.component";
import CreateServerOverlayComponent from "components/overlay/CreateServerOverlay/CreateServerOverlay.component";

import JoinServerOverlayComponent from "components/overlay/JoinServerOverlay/JoinServerOverlay.component";
import {selectIsBackendInitialized, selectOverlay} from "state-management/selectors/data.selector";
import ImageInputOverlayComponent from "components/overlay/ImageInputOverlay/ImageInputOverlay.component";
import {OverlayTypes} from "types/UISelectionModes";
import LoadingComponent from "components/Loading/Loading.component";
import {useKeycloak} from "@react-keycloak/web";
import {getUserData, useSocket} from "providers/ReactSocketIO.provider";
import useAsyncEffect from "util/useAsyncEffect";
import {useLazyLoginQuery} from "state-management/apis/http.api";
import styles from "components/App/App.module.css";
import CreateChannelOverlayComponent from "components/overlay/CreateChannelOverlay/CreateChannelOverlay.component";
import CreateGroupOverlayComponent from "components/overlay/CreateGroupOverlay/CreateGroupOverlay.component";
import InvitationOverlayComponent from "components/overlay/InvitationOverlay/InvitationOverlay.component";
import AddServerOverlayComponent from "components/overlay/AddServerOverlay/AddServerOverlay.component";
import AddFriendOverlayComponent from "components/overlay/AddFriendOverlay/AddFriendOverlay.component";
import HeaderComponent from "components/Header/Header.component";
import ThirdPanelComponent from "components/third-panel/ThirdPanel/ThirdPanel.component";
import ForthPanelComponent from "components/forth-panel/ForthPanel.component";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import ServerSettingsComponent from "components/settings/ServerSettings/ServerSettings.component";
import UserSettingsComponent from "components/settings/UserSettings/UserSettings.component";

function AppComponent() {

    const isBackendInitialized = useAppSelector(selectIsBackendInitialized);
    const overlay = useAppSelector(selectOverlay);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const {keycloak, initialized} = useKeycloak();
    const {socket, connected} = useSocket();
    const [fetchLogin, {data: loginData, isSuccess: isLoginSuccess}] = useLazyLoginQuery();

    useEffect(() => {
        if (config.offline) return;
        if (!initialized) return;
        if (!keycloak.authenticated) {
            keycloak.login();
        } else {
            keycloak.loadUserInfo().then(() => {
                fetchLogin();
            });
        }
    }, [fetchLogin, keycloak, initialized]);

    useAsyncEffect(async () => {
        if (config.offline) {
            dispatch(initializeBackend(processedServerData));
            return;
        }
        if (!connected || isBackendInitialized) return;
        const backendData = await getUserData();
        dispatch(initializeBackend(backendData));
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBackendInitialized, connected]);

    useEffect(() => {
        if (!isLoginSuccess || loginData === undefined) return;
        socket.auth = {token: loginData};
        if (!socket.connected) socket.connect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoginSuccess]);

    return isLoading && !config.offline ?
        <LoadingComponent/>
        :
        (
            <>
                <DndProvider backend={HTML5Backend}>
                    <FirstPanelComponent/>
                    <SecondPanelComponent/>
                </DndProvider>
                <div className={styles.contentContainer}>
                    <HeaderComponent/>
                    <div className={styles.mainContainer}>
                        <ThirdPanelComponent/>
                        <ForthPanelComponent/>
                    </div>
                </div>
                {
                    overlay === null ||
                    overlayToComponent(overlay)
                }
            </>
        );
}

function overlayToComponent({type, payload}: { type: number, payload: any }) {
    switch (type) {
        case OverlayTypes.AddServerOverlayComponent:
            return <AddServerOverlayComponent/>;
        case OverlayTypes.CreateChannelOverlayComponent:
            return <CreateChannelOverlayComponent groupId={payload.groupId} groupName={payload.groupName}/>;
        case OverlayTypes.CreateGroupOverlayComponent:
            return <CreateGroupOverlayComponent/>;
        case OverlayTypes.CreateServerOverlayComponent:
            return <CreateServerOverlayComponent/>;
        case OverlayTypes.InvitationOverlayComponent:
            return <InvitationOverlayComponent invitation={payload.invitation}/>;
        case OverlayTypes.JoinServerOverlayComponent:
            return <JoinServerOverlayComponent/>;
        case OverlayTypes.ImageInputOverlayComponent:
            return <ImageInputOverlayComponent image={payload.image}/>;
        case OverlayTypes.AddFriendOverlayComponent:
            return <AddFriendOverlayComponent/>;
        case OverlayTypes.ServerSettingsComponent:
            return <ServerSettingsComponent/>;
        case OverlayTypes.UserSettingsComponent:
            return <UserSettingsComponent/>;
    }
}

export default AppComponent;

