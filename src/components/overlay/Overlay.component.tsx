import styled from "styled-components";
import {ReactNode} from "react";
import XSVG from "../../svg/X.svg";
import {useAppDispatch} from "../../state-management/store";
import {setOverlay} from "../../state-management/slices/data/data.slice";

type ComponentProps = {
    title?: string,
    description?: string,
    children?: ReactNode;
}

function OverlayComponent({title, description, children}: ComponentProps) {

    const dispatch = useAppDispatch();

    function closeOverlay() {
        dispatch(setOverlay(null));
    }

    return (
        <DivOverlay>
            <DivContainer>
                <CloseButton type="button" className="btn" onClick={closeOverlay}>
                    <XSVG/>
                </CloseButton>
                <Header>
                    {
                        title === undefined ||
                        <h1 className="h1">{title}</h1>
                    }
                    {
                        description === undefined ||
                        <h5 className="h1">{description}</h5>
                    }
                </Header>
                {children}
            </DivContainer>
        </DivOverlay>
    );
}

/* CSS */

const DivOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const DivContainer = styled.div`
  min-width: 30em;
  min-height: 15em;
  background-color: var(--color-secondary);
  display: flex;
  flex-direction: column;
  border: solid var(--color-secondary);
  border-radius: 0.3em;
  position: relative;
  color: white;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0.5em;
  top: 0.5em;
  display: flex;
  justify-content: center;
  align-content: center;

  &:hover {
    color: black;
  }

`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  max-width: 30em;
`;

/* CSS */

export default OverlayComponent;