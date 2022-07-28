// LIBRARIES
import styled, { css} from "styled-components";

export const Container = styled.div(
  ({ style }) => css`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 3rem;
    gap: ${style.styleType === "mobile" ? "0.5rem" : "1.5rem"};
  `
);

export const ServerIconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
`;
export const ServerIcon = styled.img`
  width: 100%;
  height: 100%;
`;
