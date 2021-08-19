import {setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";

function AddServerOverlayComponent() {
  const dispatch = useAppDispatch();

  function createServer() {
    dispatch(setOverlay({type: "CreateServerOverlayComponent"}));
  }

  function joinServer() {
    dispatch(setOverlay({type: "JoinServerOverlayComponent"}));
  }

  return (
      <div className="overlay">
        <div className="overlay__container">
          <h1 className="h1">Add a server</h1>
          <div className="overlay__body">
            <button type="button" className="btn btn__overlay-select" onClick={createServer}>Create a server</button>
            <button type="button" className="btn btn__overlay-select" onClick={joinServer}>Join a server</button>
          </div>
        </div>
      </div>
  );

}

export default AddServerOverlayComponent;