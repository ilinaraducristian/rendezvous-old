import styled from "styled-components";
import {ReactNode} from "react";
import XSVGSvg from "svg/XSVG/XSVG.svg";
import {useAppDispatch} from "state-management/store";
import {setOverlay} from "state-management/slices/data/data.slice";

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
                    <XSVGSvg/>
                </CloseButton>
                <Header>
                    {
                        title === undefined ||
                        <h1>{title}</h1>
                    }
                    {
                        description === undefined ||
                        <h5>{description}</h5>
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
  background-color: var(--color-2nd);
  display: flex;
  flex-direction: column;
  border: solid var(--color-2nd);
  border-radius: 0.3em;
  position: relative;
  color: white;
  align-items: center;
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