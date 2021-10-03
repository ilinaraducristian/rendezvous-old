import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "state-management/store";
import config from "config";
import {processedServerData} from "mock-data";
import {initializeBackend} from "state-management/slices/data/data.slice";
import FirstPanelComponent from "components/first-panel/FirstPanel/FirstPanel.component";
import SecondPanelComponent from "components/second-panel/SecondPanel/SecondPanel.component";
import ThirdPanelComponent from "components/third-panel/ThirdPanel.component";
import AddServerOverlayComponent from "components/overlay/AddServerOverlay/AddServerOverlay.component";
import CreateChannelOverlayComponent from "components/overlay/CreateChannelOverlay.component";
import CreateGroupOverlayComponent from "components/overlay/CreateGroupOverlay.component";
import CreateServerOverlayComponent from "components/overlay/CreateServerOverlay/CreateServerOverlay.component";
import InvitationOverlayComponent from "components/overlay/InvitationOverlay/InvitationOverlay.component";
import JoinServerOverlayComponent from "components/overlay/JoinServerOverlay/JoinServerOverlay.component";
import {
    selectIsBackendInitialized,
    selectIsSettingsShown,
    selectOverlay,
} from "state-management/selectors/data.selector";
import ImageInputOverlayComponent from "components/overlay/ImageInputOverlay/ImageInputOverlay.component";
import ForthPanelComponent from "components/ForthPanel.component";
import HeaderComponent from "components/Header.component";
import AddFriendOverlayComponent from "components/overlay/AddFriendOverlay.component";
import {OverlayTypes} from "types/UISelectionModes";
import SettingsPanelComponent from "components/settings/SettingsPanel.component";
import LoadingComponent from "components/app/Loading/Loading.component";
import {useKeycloak} from "@react-keycloak/web";
import {getUserData, useSocket} from "providers/ReactSocketIO.provider";
import useAsyncEffect from "util/useAsyncEffect";
import {useLazyLoginQuery} from "state-management/apis/http.api";
import styles from "components/app/App/App.module.css";

function AppComponent() {

    const isBackendInitialized = useAppSelector(selectIsBackendInitialized);
    const overlay = useAppSelector(selectOverlay);
    const isSettingsShown = useAppSelector(selectIsSettingsShown);
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
                <FirstPanelComponent/>
                <SecondPanelComponent/>
                <div className={styles.contentContainer}>
                    <HeaderComponent/>
                    <div className={styles.mainContainer}>
                        <ThirdPanelComponent/>
                        <ForthPanelComponent/>
                    </div>
                </div>
                {
                    !isSettingsShown ||
                    <SettingsPanelComponent/>
                }
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
            return <CreateChannelOverlayComponent groupId={payload.groupId}/>;
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
    }
}

export default AppComponent;

