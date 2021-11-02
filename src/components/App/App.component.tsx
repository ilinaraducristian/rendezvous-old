import {useState} from "react";
import {useAppDispatch, useAppSelector} from "state-management/store";
import config from "config";
import FirstPanelComponent from "components/first-panel/FirstPanel/FirstPanel.component";
import SecondPanelComponent from "components/second-panel/SecondPanel/SecondPanel.component";
import CreateServerOverlayComponent from "components/overlay/CreateServerOverlay/CreateServerOverlay.component";

import JoinServerOverlayComponent from "components/overlay/JoinServerOverlay/JoinServerOverlay.component";
import {selectOverlay} from "state-management/selectors/data.selector";
import ImageInputOverlayComponent from "components/overlay/ImageInputOverlay/ImageInputOverlay.component";
import {OverlayTypes} from "types/UISelectionModes";
import LoadingComponent from "components/Loading/Loading.component";
import useAsyncEffect from "util/useAsyncEffect";
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
import keycloak from "keycloak";
import socket, {getRouterCapabilities, getUserData} from "providers/socketio";
import {initializeBackend} from "state-management/slices/data/data.slice";
import mediasoup from "providers/mediasoup";

function AppComponent() {

    const overlay = useAppSelector(selectOverlay);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useAsyncEffect(async () => {
        if (config.offline) return;
        try {
            let authenticated = await keycloak.init({
                onLoad: "check-sso",
                silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`
            });
            if (!authenticated) {
                authenticated = await keycloak.login();
                if (!authenticated) return;
            }
            await keycloak.loadUserInfo();

            const {token} = await fetch(`${config.backend}/login`, {
                headers: {
                    "Authorization": `Bearer ${keycloak.token}`
                }
            }).then(res => res.json());
            socket.auth = {token};
            await socket.connectAndWait();

            const userData = await getUserData();
            dispatch(initializeBackend(userData));

            const routerCapabilities = await getRouterCapabilities();
            await mediasoup.load(routerCapabilities);
            setIsLoading(false);
        } catch (e) {
            console.error(e);
        }
    }, []);

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

