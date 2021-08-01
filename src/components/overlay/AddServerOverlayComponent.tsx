import {serversDataSlice} from "../../state-management/slices/serversDataSlice";
import CreateServerOverlayComponent from "./CreateServerOverlayComponent";
import JoinServerOverlayComponent from "./JoinServerOverlayComponent";

function AddServerOverlayComponent() {

  function createServer() {
    serversDataSlice.actions.setOverlay(<CreateServerOverlayComponent/>);
  }

  function joinServer() {
    serversDataSlice.actions.setOverlay(<JoinServerOverlayComponent/>);
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