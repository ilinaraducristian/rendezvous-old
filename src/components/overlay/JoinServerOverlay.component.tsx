import {useRef} from "react";

import {addServer, addUser, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay.component";
import styled from "styled-components";
import {joinServer} from "../../socketio/ReactSocketIOProvider";

function JoinServerOverlayComponent() {

    const ref = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();

    async function joinServerCallback() {
        if (ref.current === null) return;
        const text = ref.current.value;
        if (text.trim().length === 0) return;
        const data = await joinServer({invitation: text});
        dispatch(addServer(data.servers[0]));
        dispatch(addUser(data.users[0]));
        dispatch(setOverlay(null));
    }

    return (
        <OverlayComponent title={"Join a server"} description={"Enter an invite below to join an existing server"}>
            <Div>
                <H5>INVITE LINK</H5>
                <Input type="text" ref={ref} placeholder="86a7bbe5-c049-45da-8992-92f0f9c77cfc"/>
                <Button type="button" className="btn" onClick={joinServerCallback}>
                    Join Server
                </Button>
            </Div>
        </OverlayComponent>
    );

}

/* CSS */

const Div = styled.div`
  display: flex;
  flex-direction: column;
`;

const H5 = styled.h5`
  padding: 0;
  margin: 1em 0 0.5em 1em;
`;

const Input = styled.input`
  --color: var(--color-21th);
  background: var(--color);
  border: solid var(--color);
  margin: 0 1em 2em 1em;
  border-radius: 0.2em;

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  --color: var(--color-17th);
  background-color: var(--color);
  border: solid var(--color);
  border-radius: 0.2em;
  width: 7.2em;
  height: 2.85em;
  align-self: center;
  transition: background-color 200ms, border 200ms;

  &:hover {
    --color: var(--color-20th);
  }

`;

/* CSS */

export default JoinServerOverlayComponent;