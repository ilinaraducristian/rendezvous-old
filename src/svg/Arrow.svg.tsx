import styled from "styled-components";

type ComponentProps = {
  isCollapsed?: boolean;
}

const SvgArrow = styled.svg<ComponentProps>`
  transition: transform .2s ease-out, -webkit-transform .2s ease-out;
  transform: ${props => props.isCollapsed ? "rotate(-90deg)" : "none"};
`;

function ArrowSVG({isCollapsed = true}: ComponentProps) {

  return (
      <SvgArrow isCollapsed={isCollapsed} width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" fillRule="evenodd" clipRule="evenodd"
              d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"
        />
      </SvgArrow>
  );

}

function ArrowXSVG({isCollapsed = true}: ComponentProps) {
  return (
      <SvgArrow isCollapsed={isCollapsed} width="18" height="18">
        <g fill="none" fillRule="evenodd">
          <path d="M0 0h18v18H0"/>
          <path stroke="currentColor" d="M4.5 4.5l9 9" strokeLinecap="round"/>
          <path stroke="currentColor" d="M13.5 4.5l-9 9" strokeLinecap="round"/>
        </g>
      </SvgArrow>
  );
}

export {ArrowSVG, ArrowXSVG};