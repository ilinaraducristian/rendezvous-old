import {useCallback, useContext, useMemo, useRef} from "react";
import {Channel, Group, Member, Server, User} from "../../types";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import SortedMap from "../../util/SortedMap";
import {responseToSortedMap} from "../../util/functions";

function JoinServerOverlayComponent() {
  const Backend = useBackend();

  const {dispatch} = useContext(GlobalStates);
  const ref = useRef<HTMLInputElement>(null);

  const joinServer = useCallback(async () => {
    let response = await Backend.joinServer(ref.current?.value as string);
    response = responseToSortedMap(response);
    console.log(response);
    dispatch({
      type: Actions.SERVERS_SET,
      payload: (oldServers: SortedMap<Server>) => new SortedMap<Server>(oldServers.concat(response.servers))
    });
    dispatch({
      type: Actions.CHANNELS_SET,
      payload: (oldChannels: SortedMap<Channel>) => new SortedMap<Channel>(oldChannels.concat(response.channels))
    });
    dispatch({
      type: Actions.GROUPS_SET,
      payload: (oldGroups: SortedMap<Group>) => new SortedMap<Group>(oldGroups.concat(response.groups))
    });
    dispatch({
      type: Actions.MEMBERS_SET,
      payload: (oldMembers: SortedMap<Member>) => new SortedMap<Member>(oldMembers.concat(response.members))
    });
    // TODO
    dispatch({
      type: Actions.USERS_SET,
      payload: (oldUsers: Map<string, User>) => new Map<string, User>([...oldUsers, ...response.users])
    });
    dispatch({type: Actions.OVERLAY_SET, payload: null});
  }, [Backend, dispatch]);

  return useMemo(() =>
          <div className="overlay">
            <div className="overlay__container">
              <h1 className="h1">Join a server</h1>
              <div className="overlay__body">
                <input type="text" ref={ref}/>
                <button type="button" className="btn btn__overlay-select" onClick={joinServer}>Join
                </button>
              </div>
              {/*<input type="text" onChange={e => setServerName(e.target.value)}/>*/}
              {/*<button className="button" type="button" onClick={() => createServer(serverName, 0)}>*/}
              {/*  Create*/}
              {/*</button>*/}
              {/*<button className="button" type="button" onClick={() => joinServer(invitation)}>Join</button>*/}
            </div>
          </div>
      , [joinServer]);

}

export default JoinServerOverlayComponent;