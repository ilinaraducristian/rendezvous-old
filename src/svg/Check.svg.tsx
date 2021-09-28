import styled from "styled-components";

type ComponentProps = {
    as?: any
}

function CheckSVG({as}: ComponentProps) {
    return (
        <Svg as={as} viewBox="0 0 24 24">
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd"
                  d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"/>
        </Svg>
    );
}

/* CSS */

const Svg = styled.svg`
  width: 24px;
  height: 24px;
`;

/* CSS */

export default CheckSVG;