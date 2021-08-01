import {useRef} from "react";
import {Server} from "../../types";
import config from "../../config";
import {useAppSelector} from "../../state-management/store";
import {selectSelectedServer, selectServers, serversDataSlice} from "../../state-management/slices/serversDataSlice";
import {useCreateGroupQuery} from "../../state-management/apis/socketio";

function CreateGroupOverlayComponent() {

  const ref = useRef<HTMLInputElement>(null);
  const selectedServer = useAppSelector(selectSelectedServer);
  const servers = useAppSelector(selectServers);

  function createGroup() {
    if (config.offline) return;
    if (selectedServer === null) return;
    const groupName = ref.current?.value as string;
    const _selectedServer = servers.get(selectedServer.id) as Server;
    const {data} = useCreateGroupQuery({serverId: _selectedServer.id, groupName});
    if (data === undefined) return;
    serversDataSlice.actions.setGroup({
      id: data.groupId,
      serverId: _selectedServer.id,
      name: groupName
    });
  }

  return (
      <div className="overlay">
        <div className="overlay__container">
          <h1 className="h1">Group name</h1>
          <input type="text" ref={ref}/>
          <button type="button" className="btn btn__overlay-select" onClick={createGroup}>Create
          </button>
        </div>
      </div>
  );
}

export default CreateGroupOverlayComponent;