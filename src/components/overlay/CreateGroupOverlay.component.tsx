import {useEffect, useRef} from "react";
import config from "../../config";
import {useLazyCreateGroupQuery} from "../../state-management/apis/socketio";
import {selectSelectedServer} from "../../state-management/slices/serversDataSlice";
import {useAppSelector} from "../../state-management/store";

function CreateGroupOverlayComponent() {

  const ref = useRef<HTMLInputElement>(null);
  const selectedServer = useAppSelector(selectSelectedServer);
  const [fetch, {data}] = useLazyCreateGroupQuery();

  function createGroup() {
    if (config.offline) return;
    if (selectedServer === undefined) return;
    const groupName = ref.current?.value as string;
    fetch({serverId: selectedServer.id, groupName});
  }

  useEffect(() => {
    if (data === undefined) return;
    if (selectedServer === undefined) return;
    // const groupName = ref.current?.value as string;
    // dispatch(setGroup({
    //   id: data.groupId,
    //   serverId: selectedServer.id,
    //   name: groupName
    // }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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