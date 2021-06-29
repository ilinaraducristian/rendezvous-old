import {useCallback, useContext, useMemo, useRef} from "react";
import {Channel, ChannelType, Group, Member, Server} from "../../types";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import SortedMap from "../../util/SortedMap";
import {useKeycloak} from "@react-keycloak/web";

function CreateServerOverlayComponent() {

  const Backend = useBackend();
  const {dispatch} = useContext(GlobalStates);
  const {keycloak} = useKeycloak();
  const ref = useRef<HTMLInputElement>(null);

  const createServer = useCallback(async () => {
    const serverName = ref.current?.value as string;
    const response = await Backend.createServer(serverName);
    console.log(response);
    dispatch({
      type: Actions.SERVERS_SET,
      payload: (oldServers: SortedMap<Server>) => new SortedMap<Server>(oldServers.set(response.id, {
        id: response.id,
        name: serverName,
        userId: keycloak.subject as string,
        invitation: null,
        invitationExp: null
      }))
    });
    dispatch({
      type: Actions.GROUPS_SET, payload: (oldGroups: SortedMap<Group>) => {
        oldGroups.set(response.group1Id, {
          id: response.group1Id,
          serverId: response.id,
          name: "Text channels"
        });
        oldGroups.set(response.group2Id, {
          id: response.group2Id,
          serverId: response.id,
          name: "Voice channels"
        });
        return new SortedMap<Group>(oldGroups);
      }
    });
    dispatch({
      type: Actions.CHANNELS_SET, payload: (oldChannels: SortedMap<Channel>) => {
        oldChannels.set(response.chanel1Id, {
          id: response.chanel1Id,
          serverId: response.id,
          groupId: response.group1Id,
          type: ChannelType.Text,
          name: "general"
        });
        oldChannels.set(response.chanel1Id, {
          id: response.chanel1Id,
          serverId: response.id,
          groupId: response.group1Id,
          type: ChannelType.Text,
          name: "general"
        });
        return new SortedMap<Channel>(oldChannels);
      }
    });
    dispatch({
      type: Actions.MEMBERS_SET, payload: (oldMembers: SortedMap<Member>) => {
        oldMembers.set(response.memberId, {
          id: response.memberId,
          serverId: response.id,
          userId: keycloak.subject as string,
        });
        return new SortedMap(oldMembers);
      }
    });
    dispatch({type: Actions.OVERLAY_SET, payload: null});
  }, [Backend, dispatch, keycloak.subject]);

  return useMemo(() =>
          <div className="overlay">
            <div className="overlay__container">
              <h1 className="h1">Create a server</h1>
              <div className="overlay__body">
                <input type="text" ref={ref}/>
                <button type="button" className="btn btn__overlay-select" onClick={createServer}>Create
                </button>
              </div>
              {/*<input type="text" onChange={e => setInvitation(e.target.value)}/>*/}
              {/*<button className="button" type="button" onClick={() => createServer(serverName, 0)}>*/}
              {/*  Create*/}
              {/*</button>*/}
              {/*<button className="button" type="button" onClick={() => joinServer(invitation)}>Join</button>*/}
            </div>
          </div>
      , [createServer]);

}

export default CreateServerOverlayComponent;