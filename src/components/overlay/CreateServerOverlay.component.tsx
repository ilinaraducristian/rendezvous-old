import {useEffect, useRef} from "react";
import {useLazyCreateServerQuery} from "state-management/apis/socketio";
import {addServer, addUser, setOverlay} from "state-management/slices/serversSlice";
import {useAppDispatch} from "state-management/store";

function CreateServerOverlayComponent() {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLInputElement>(null);
  const [fetch, {data, isSuccess}] = useLazyCreateServerQuery();

  function createServer() {
    fetch(ref.current?.value as string);
  }

  useEffect(() => {
    if (!isSuccess) return;
    if (data === undefined) return;
    dispatch(setOverlay(null));
    dispatch(addServer(data.servers[0]));
    dispatch(addUser(data.users[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
      <div className="overlay">
        <div className="overlay__container">
          <h1 className="h1">Create a server</h1>
          <div className="overlay__body">
            <input type="text" ref={ref}/>
            <button type="button" className="btn btn__overlay-select" onClick={createServer}>Create
            </button>
          </div>
        </div>
      </div>
  );

}

export default CreateServerOverlayComponent;