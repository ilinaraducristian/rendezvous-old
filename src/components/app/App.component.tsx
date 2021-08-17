import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectAuthenticated} from "state-management/slices/keycloakSlice";
import keycloak from "keycloak";
import {selectConnected} from "state-management/slices/socketioSlice";
import config from "config";
import {mockServers, mockUsers} from "mock-data";
import {initializeBackend,} from "state-management/slices/serversSlice";
import ServersPanelComponent from "components/server/ServersPanel.component";
import {useLazyGetUserDataQuery} from "state-management/apis/socketio";
import ChannelsPanelComponent from "components/channels/ChannelsPanel.component";
import ContentPanelComponent from "components/content/ContentPanel.component";
import AddServerOverlayComponent from "components/overlay/AddServerOverlay.component";
import CreateChannelOverlayComponent from "components/overlay/CreateChannelOverlay.component";
import CreateGroupOverlayComponent from "components/overlay/CreateGroupOverlay.component";
import CreateServerOverlayComponent from "components/overlay/CreateServerOverlay.component";
import InvitationOverlayComponent from "components/overlay/InvitationOverlay.component";
import JoinServerOverlayComponent from "components/overlay/JoinServerOverlay.component";
import {selectInitialized, selectJoinedChannel, selectOverlay, selectSelectedServer} from "state-management/selectors";

function AppComponent() {

  const authenticated = useAppSelector(selectAuthenticated);
  const connected = useAppSelector(selectConnected);
  const initialized = useAppSelector(selectInitialized);
  const selectedServer = useAppSelector(selectSelectedServer);
  const overlay = useAppSelector(selectOverlay);
  const joinedChannel = useAppSelector(selectJoinedChannel);
  const [fetch, {data, isSuccess, status}] = useLazyGetUserDataQuery();
  const dispatch = useAppDispatch();
  // const users = channel.users?.filter(user => user.userId !== subject)
  //     .filter(user => !consumers.find(consumer => user.socketId === consumer.socketId));
  // // create consumers
  // if (users === undefined) return;
  // createMediaStreamSource();
  // (async () => {
  //   for (const user of users) {
  //     const {transportParameters} = await socket.emitAck("create_transport", {type: "recv"});
  //     const recvTransport = mediasoup.createRecvTransport(transportParameters);
  //     recvTransport.on("connect", ({dtlsParameters}, cb) => {
  //       socket.emit("connect_transport", {type: "recv", dtlsParameters, id: recvTransport.id}, cb);
  //     });
  //     const {consumerParameters} = await socket.emitAck("create_consumer", {
  //       transportId: recvTransport.id,
  //       socketId: user.socketId,
  //       rtpCapabilities: mediasoup.rtpCapabilities
  //     });
  //     const consumer = await recvTransport.consume(consumerParameters);
  //     remoteStream.addTrack(consumer.track);
  //     socket.emit("resume_consumer", {id: consumer.id});
  //     consumers.push({socketId: user.socketId, consumer});
  //   }
  // })();
  useEffect(() => {
    if (joinedChannel === null) {
      //disconnect
      return;
    }
    if (selectedServer === undefined) return;
    if (joinedChannel.groupId === null) {
      const channel = selectedServer.channels.find(channel => channel.id === joinedChannel.channelId);
      if (channel === undefined) return;
    } else {
      const channel = selectedServer.groups.find(group => group.id === joinedChannel.groupId)?.channels.find(channel => channel.id === joinedChannel.channelId);
      if (channel === undefined) return;
    }
  }, [joinedChannel]);

  useEffect(() => {
    if (config.offline) return;
    if (authenticated) return;
    keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html"
    })
        .then((authenticated: boolean) => {
          if (!authenticated) {
            return keycloak.login();
          }
        }).catch(() => {
      alert("failed to initialize");
    });
  }, [authenticated]);

  useEffect(() => {
    if (config.offline) {
      const processedServerData = {
        servers: mockServers,
        users: mockUsers
      };
      dispatch(initializeBackend(processedServerData));
      return;
    }
    if (!connected) return;
    if (initialized) return;
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, connected]);

  useEffect(() => {
    if (!isSuccess) return;
    if (data === undefined) return;
    dispatch(initializeBackend(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
      <>
        {/*((!initialized || !keycloak.authenticated) && !config.offline) ||*/}
        {
          overlay === null ||
          overlayToComponent(overlay)
        }
        <ServersPanelComponent/>
        <ChannelsPanelComponent/>
        <ContentPanelComponent/>
      </>
  );

}

function overlayToComponent({type, payload}: { type: string, payload: any }) {
  switch (type) {
    case "AddServerOverlayComponent":
      return <AddServerOverlayComponent/>;
    case "CreateChannelOverlayComponent":
      return <CreateChannelOverlayComponent groupId={payload.groupId}/>;
    case "CreateGroupOverlayComponent":
      return <CreateGroupOverlayComponent/>;
    case "CreateServerOverlayComponent":
      return <CreateServerOverlayComponent/>;
    case "InvitationOverlayComponent":
      return <InvitationOverlayComponent invitation={payload.invitation}/>;
    case "JoinServerOverlayComponent":
      return <JoinServerOverlayComponent/>;
  }
}

export default AppComponent;

