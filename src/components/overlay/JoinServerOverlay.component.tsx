import {useEffect, useRef} from "react";
import {useLazyJoinServerQuery} from "state-management/apis/socketio";
import {addServer, addUser, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";

function JoinServerOverlayComponent() {

  const ref = useRef<HTMLInputElement>(null);
  const [fetch, {data, isSuccess}] = useLazyJoinServerQuery();
  const dispatch = useAppDispatch();

  function joinServer() {
    fetch(ref.current?.value as string);
  }

  useEffect(() => {
    if (!isSuccess) return;
    if (data === undefined) return;
    dispatch(addServer(data.servers[0]));
    dispatch(addUser(data.users[0]));
    dispatch(setOverlay(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
      <div className="overlay">
        <div className="overlay__container">
          <h1 className="h1">Join a server</h1>
          <div className="overlay__body">
            <input type="text" ref={ref}/>
            <button type="button" className="btn btn__overlay-select" onClick={joinServer}>Join
            </button>
          </div>
        </div>
      </div>
  );

}

export default JoinServerOverlayComponent;