import styled from "styled-components";

const DropHandleComponent = styled.div<{ Hidden: boolean }>`

  height: 0.5em;
  background-color: ${props => props.Hidden ? "transparent" : "green"};

`;

export default DropHandleComponent;