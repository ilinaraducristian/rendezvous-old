// LIBRARIES
import styled, { css } from "styled-components";

export const Container = styled.div(
  ({ style }) => css`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 1rem 0rem 1rem;
    gap: ${style.styleType === "mobile" ? "1rem" : "1.5rem"};
  `
);

export const ServerIconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
`;
export const ServerIcon = styled.img`
  width: 100%;
  height: 100%;
`;
