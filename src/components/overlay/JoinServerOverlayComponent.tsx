import {useRef} from "react";
import {serversDataSlice} from "../../state-management/slices/serversDataSlice";
import {useJoinServerQuery} from "../../state-management/apis/socketio";

function JoinServerOverlayComponent() {

  const ref = useRef<HTMLInputElement>(null);

  function joinServer() {
    const {data} = useJoinServerQuery(ref.current?.value as string);
    if (data === undefined) return;
    serversDataSlice.actions.addServer(data);
  }

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