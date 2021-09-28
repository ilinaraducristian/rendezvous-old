import styled from "styled-components";

type ComponentProps = {
    as?: any
}

function Plus2SVG({as}: ComponentProps) {
    return (
        <Svg as={as} viewBox="0 0 24 24">
            <path fill="currentColor"
                  d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"/>
        </Svg>
    );
}

/* CSS */

const Svg = styled.svg`
  width: 24px;
  height: 24px;
`;

/* CSS */

export default Plus2SVG;