import {useEffect, useRef} from "react";
import {useLazyCreateServerQuery} from "../../state-management/apis/socketio";
import {serversDataSlice} from "../../state-management/slices/serversDataSlice";

function CreateServerOverlayComponent() {

  const ref = useRef<HTMLInputElement>(null);
  const [fetch, {data}] = useLazyCreateServerQuery();

  function createServer() {
    fetch(ref.current?.value as string);
  }

  useEffect(() => {
    if (data === undefined) return;
    serversDataSlice.actions.addServer(data);
  }, [data]);

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