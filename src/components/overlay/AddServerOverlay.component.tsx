import {setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay.component";
import {OverlayTypes} from "../../types/UISelectionModes";

function AddServerOverlayComponent() {
  const dispatch = useAppDispatch();

  function createServer() {
      dispatch(setOverlay({type: OverlayTypes.CreateServerOverlayComponent}));
  }

  function joinServer() {
      dispatch(setOverlay({type: OverlayTypes.JoinServerOverlayComponent}));
  }

  return (
      <OverlayComponent>
        <h1 className="h1">Add a server</h1>
        <div className="overlay__body">
          <button type="button" className="btn btn__overlay-select" onClick={createServer}>Create a server</button>
          <button type="button" className="btn btn__overlay-select" onClick={joinServer}>Join a server</button>
        </div>
      </OverlayComponent>
  );

}

export default AddServerOverlayComponent;