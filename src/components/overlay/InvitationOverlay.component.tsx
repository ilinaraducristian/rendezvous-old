import {useCallback, useState} from "react";
import {setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";

type ComponentProps = {
  invitation: string
}

function InvitationOverlayComponent({invitation}: ComponentProps) {

  const [status, setStatus] = useState("Copy");
  const dispatch = useAppDispatch();

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(invitation);
      setStatus("Copied");
    } catch (e) {
      console.error(e);
      setStatus("Error");
    }
  }, [invitation]);

  function close() {
    dispatch(setOverlay(null));
  }

  return (
      <div className="overlay">
        <div className="overlay__container">
          <button type="button" onClick={close}>X</button>
          <h1 className="h1">Share the invitation with a friend</h1>
          <div className="overlay__body">
            <span className="span">{invitation}</span>
            <button type="button" className="btn btn__overlay-select" onClick={copyToClipboard}>
              {status}
            </button>
          </div>
        </div>
      </div>
  );

}

export default InvitationOverlayComponent;