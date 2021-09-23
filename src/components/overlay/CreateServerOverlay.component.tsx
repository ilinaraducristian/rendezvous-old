import {useEffect, useRef} from "react";
import {useLazyCreateServerQuery} from "state-management/apis/socketio.api";
import {addServer, addUser, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay.component";
import styled from "styled-components";

function CreateServerOverlayComponent() {
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLInputElement>(null);
    const [fetch, {data, isSuccess}] = useLazyCreateServerQuery();

    function createServer() {
        if (ref.current === null) return;
        fetch({name: ref.current.value});
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
        <OverlayComponent>
            <h1 className="h1">Create a server</h1>
            <Div>
                <input type="text" ref={ref}/>
                <button type="button" className="btn btn__overlay-select" onClick={createServer}>Create
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