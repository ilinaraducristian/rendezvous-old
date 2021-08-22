import {useEffect} from "react";
import {store, useAppDispatch, useAppSelector} from "state-management/store";
import {selectConnected} from "state-management/slices/socketio.slice";
import config from "config";
import {mockServers, mockUsers} from "mock-data";
import {initializeBackend, setOverlay,} from "state-management/slices/data/data.slice";
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
import {
  selectIsBackendInitialized,
  selectJoinedChannel,
  selectOverlay,
  selectSelectedServer
} from "state-management/selectors/data.selector";
import {selectJoinedChannelUsers} from "state-management/selectors/channel.selector";
import mediasoup, {createMediaStreamSource, remoteStream} from "mediasoup";
import socket from "socketio";
import authClient from "keycloak";
import ImageInputOverlayComponent from "components/message/ImageInputOverlay.component";
import {useLazyLoginQuery} from "state-management/apis/http";

const consumers: any[] = [];

document.onkeyup = (event: any) => {
  if (event.code !== "Escape") return false;
  store.dispatch(setOverlay(null));
};

function AppComponent() {

  // const authenticated = useAppSelector(selectAuthenticated);
  const connected = useAppSelector(selectConnected);
  const isBackendInitialized = useAppSelector(selectIsBackendInitialized);
  const selectedServer = useAppSelector(selectSelectedServer);
  const overlay = useAppSelector(selectOverlay);
  const joinedChannel = useAppSelector(selectJoinedChannel);
  const joinedChannelUsers = useAppSelector(selectJoinedChannelUsers);
  // const subject = useAppSelector(selectSubject);
  const [fetch, {data, isSuccess, status}] = useLazyGetUserDataQuery();
  const [fetchLogin, {data: loginData, isSuccess: loginSuccess}] = useLazyLoginQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (joinedChannel === null) {
      //disconnect
      return;
    }
    (async () => {
      const subject = await authClient.getSubject();
      const users = joinedChannelUsers.filter(user => user.userId !== subject &&
          !consumers.find(consumer => user.socketId === consumer.socketId));
      createMediaStreamSource();
      const promises: Promise<void>[] = [];
      users.forEach(user => {
        promises.push(
            new Promise<void>(async (resolve) => {
              const {transportParameters} = await socket.emitAck("create_transport", {type: "recv"});
              const recvTransport = mediasoup.createRecvTransport(transportParameters);
              recvTransport.on("connect", ({dtlsParameters}, cb) => {
                socket.emit("connect_transport", {type: "recv", dtlsParameters, id: recvTransport.id}, cb);
              });
              const {consumerParameters} = await socket.emitAck("create_consumer", {
                transportId: recvTransport.id,
                socketId: user.socketId,
                rtpCapabilities: mediasoup.rtpCapabilities
              });
              const consumer = await recvTransport.consume(consumerParameters);
              remoteStream.addTrack(consumer.track);
              socket.emit("resume_consumer", {id: consumer.id});
              consumers.push({socketId: user.socketId, consumer});
              resolve();
            })
        );
      });
      await Promise.all(promises);
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
        // socket.auth.token = authClient.getToken();
        // if (!socket.connected) socket.connect();
      }
    })();
  }, []);

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
    if (isBackendInitialized) return;
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBackendInitialized, connected]);

  useEffect(() => {
    if (!loginSuccess) return;
    if (loginData === undefined) return;
    socket.auth.token = loginData;
    if (!socket.connected) socket.connect();
  }, [loginSuccess]);

  useEffect(() => {
    if (!isSuccess) return;
    if (data === undefined) return;
    dispatch(initializeBackend(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
      <>
        {/*((!initialized || !keycloak.authenticated) && !config.offline) ||*/}
        <ServersPanelComponent/>
        <ChannelsPanelComponent/>
        <ContentPanelComponent/>
        {
          overlay === null ||
          overlayToComponent(overlay)
        }
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
    case "ImageInputOverlayComponent":
      return <ImageInputOverlayComponent image={payload.image}/>;
  }
}

export default AppComponent;

