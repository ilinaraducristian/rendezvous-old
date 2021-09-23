import styled from "styled-components";
/* CSS */

const AvatarSVG = styled.div<{ sursa: any, isActive: boolean }>`
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background-image: url(${props => props.sursa});
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 100%;
  ${({isActive}) => isActive ? "box-shadow: inset 0 0 0 2px hsl(139, 47.3%, 43.9%), inset 0 0 0 3px #2f3136;" : ""}
`;

/* CSS */

export default AvatarSVG;