import {useRef} from "react";

import {addServer, addUser, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay.component";
import styled from "styled-components";
import {createServer} from "../../socketio/ReactSocketIOProvider";

function CreateServerOverlayComponent() {
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLInputElement>(null);

    async function createServerCallback() {
        if (ref.current === null) return;
        const data = await createServer({name: ref.current.value});
        dispatch(addServer(data.servers[0]));
        dispatch(addUser(data.users[0]));
        dispatch(setOverlay(null));
    }

    return (
        <OverlayComponent>
            <h1 className="h1">Create a server</h1>
            <Div>
                <input type="text" ref={ref}/>
                <button type="button" className="btn btn__overlay-select" onClick={createServerCallback}>Create
                </button>
            </Div>
        </OverlayComponent>
    );

}

/* CSS */

const Div = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1em;
`;

/* CSS */

export default CreateServerOverlayComponent;