import styled from "styled-components";

type ComponentProps = {
  children: any;
}

function OverlayComponent({children}: ComponentProps) {
  return (
      <DivOverlay>
        <DivContainer>
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
  width: 30em;
  height: 15em;
  background-color: var(--color-secondary);
  display: flex;
  flex-direction: column;
  padding: 2em;
  justify-content: space-between;
  gap: 2.5em;
`;

/* CSS */

export default OverlayComponent;