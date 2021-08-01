import {useMemo, useRef} from "react";
import {useCreateServerQuery} from "../../state-management/apis/socketio";
import {serversDataSlice} from "../../state-management/slices/serversDataSlice";

function CreateServerOverlayComponent() {

  const ref = useRef<HTMLInputElement>(null);

  function createServer() {
    const {data} = useCreateServerQuery(ref.current?.value as string);
    if (data === undefined) return;
    serversDataSlice.actions.addServer(data);
  }

  return useMemo(() =>
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
      , [createServer]);

}

export default CreateServerOverlayComponent;