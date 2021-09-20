import {setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay.component";
import {OverlayTypes} from "../../types/UISelectionModes";
import styled from "styled-components";

function AddServerOverlayComponent() {
    const dispatch = useAppDispatch();

    function createServer() {
        dispatch(setOverlay({type: OverlayTypes.CreateServerOverlayComponent}));
    }

    function joinServer() {
        dispatch(setOverlay({type: OverlayTypes.JoinServerOverlayComponent}));
    }

    return (
        <OverlayComponent title="Add a server">
            <Div>
                <Button type="button" className="btn" onClick={createServer}>
                    Create a new server
                </Button>
                <Button type="button" className="btn" onClick={joinServer}>
                    Join a server
                </Button>
            </Div>
        </OverlayComponent>
    );

}

/* CSS */

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex-grow: 1;
`;

const Button = styled.button`
  --color: var(--color-18th);
  //background-color: var(--color);
  border: solid var(--color);
  border-radius: 1em;
  margin: 0 4.35em;
  width: 21.354em;
  height: 3.4371em;
  font-size: 1.2rem;

  &:hover {
    border-color: var(--color-8th);
  }

`;

/* CSS */

export default AddServerOverlayComponent;