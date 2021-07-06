import {useCallback, useContext, useMemo, useState} from "react";
import {Actions, GlobalStates} from "../../global-state";

type ComponentProps = {
  invitation: string
}

function InvitationOverlayComponent({invitation}: ComponentProps) {

  const {dispatch} = useContext(GlobalStates);
  const [status, setStatus] = useState("Copy");

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(invitation).then(() => {
      setStatus("Copied");
    }).catch(e => {
      console.log(e);
      setStatus("Error");
    });
  }, [invitation]);

  const close = useCallback(() => {
    dispatch({type: Actions.OVERLAY_SET, payload: null})
  }, [dispatch])

  return useMemo(() =>
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
      , [close, copyToClipboard, invitation, status]);

}

export default InvitationOverlayComponent;