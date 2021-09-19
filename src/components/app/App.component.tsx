import {useEffect, useState} from "react";
import {store, useAppDispatch, useAppSelector} from "state-management/store";
import {selectConnected} from "state-management/slices/socketio.slice";
import config from "config";
import {processedServerData} from "mock-data";
import {hideSettings, initializeBackend, setOverlay} from "state-management/slices/data/data.slice";
import FirstPanelComponent from "components/first-panel/FirstPanel.component";
import {useLazyGetUserDataQuery} from "state-management/apis/socketio.api";
import SecondPanelComponent from "components/second-panel/SecondPanel.component";
import ThirdPanelComponent from "components/third-panel/ThirdPanel.component";
import AddServerOverlayComponent from "components/overlay/AddServerOverlay.component";
import CreateChannelOverlayComponent from "components/overlay/CreateChannelOverlay.component";
import CreateGroupOverlayComponent from "components/overlay/CreateGroupOverlay.component";
import CreateServerOverlayComponent from "components/overlay/CreateServerOverlay.component";
import InvitationOverlayComponent from "components/overlay/InvitationOverlay.component";
import JoinServerOverlayComponent from "components/overlay/JoinServerOverlay.component";
import {
    selectIsBackendInitialized,
    selectIsSettingsShown,
    selectJoinedChannel,
    selectOverlay,
    selectSelectedServer
} from "state-management/selectors/data.selector";
import {selectJoinedChannelUsers} from "state-management/selectors/channel.selector";
import {consumers, createConsumer, createMediaStreamSource} from "mediasoup";
import socket from "socketio";
import authClient from "keycloak";
import ImageInputOverlayComponent from "components/overlay/ImageInputOverlay.component";
import {useLazyLoginQuery} from "state-management/apis/http.api";
import ForthPanelComponent from "../ForthPanel.component";
import HeaderComponent from "../Header.component";
import AddFriendOverlayComponent from "../overlay/AddFriendOverlay.component";
import {OverlayTypes} from "../../types/UISelectionModes";
import SettingsPanelComponent from "../settings/SettingsPanel.component";
import LoadingComponent from "./Loading.component";

document.onkeyup = (event: any) => {
    if (event.code !== "Escape") return false;
    store.dispatch(setOverlay(null));
    const isSettingsShown = selectIsSettingsShown(store.getState());
    if (isSettingsShown) store.dispatch(hideSettings(undefined));
};

function AppComponent() {

    const connected = useAppSelector(selectConnected);
    const isBackendInitialized = useAppSelector(selectIsBackendInitialized);
    const selectedServer = useAppSelector(selectSelectedServer);
    const overlay = useAppSelector(selectOverlay);
    const joinedChannel = useAppSelector(selectJoinedChannel);
    const joinedChannelUsers = useAppSelector(selectJoinedChannelUsers);
    const [fetchUserData, {data: backendData, isSuccess: isUserDataSuccess}] = useLazyGetUserDataQuery();
    const [fetchLogin, {data: loginData, isSuccess: isLoginSuccess}] = useLazyLoginQuery();
    const isSettingsShown = useAppSelector(selectIsSettingsShown);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (joinedChannel === null) {
            // TODO disconnect
            return;
        }

        (async () => {
            const subject = await authClient.getSubject();
            const users = joinedChannelUsers.filter(user => user.userId !== subject &&
                !consumers.find(consumer => user.socketId === consumer.socketId));
            createMediaStreamSource();
            await Promise.all(users.map(user => createConsumer(user.socketId)));
        })();
    }, [joinedChannelUsers, joinedChannel, selectedServer]);

    useEffect(() => {
        if (config.offline) return;
        (async () => {
            const authenticated = await authClient.isAuthenticated();
            if (authenticated) return;
            const isAuthenticated = await authClient.init();
            if (isAuthenticated) {
                fetchLogin();
            }
        })();
    }, [fetchLogin]);

    useEffect(() => {
        if (config.offline) {
            dispatch(initializeBackend(processedServerData));
            return;
        }
        if (!connected || isBackendInitialized) return;
        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBackendInitialized, connected]);

    useEffect(() => {
        if (!isLoginSuccess || loginData === undefined) return;
        socket.auth.token = loginData;
        if (!socket.connected) socket.connect();
    }, [isLoginSuccess, loginData]);

    useEffect(() => {
        if (!isUserDataSuccess || backendData === undefined) return;
        dispatch(initializeBackend(backendData));
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserDataSuccess]);

    return (
        <>
            {isLoading && !config.offline ?
                <LoadingComponent/>
                :
                <>
                    <FirstPanelComponent/>
                    <HeaderComponent/>
                    <SecondPanelComponent/>
                    <ThirdPanelComponent/>
                    <ForthPanelComponent/>
                    {
                        !isSettingsShown ||
                        <SettingsPanelComponent/>
                    }
                    {
                        overlay === null ||
                        overlayToComponent(overlay)
                    }
                </>
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

