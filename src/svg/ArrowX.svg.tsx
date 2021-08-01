function ArrowXSVG({collapsed = true}: { collapsed?: boolean }) {
  return (
      <svg width="18" height="18" className={"svg__arrow" + (collapsed || " svg__arrow--active")}>
        <g fill="none" fillRule="evenodd">
          <path d="M0 0h18v18H0"/>
          <path stroke="currentColor" d="M4.5 4.5l9 9" strokeLinecap="round"/>
          <path stroke="currentColor" d="M13.5 4.5l-9 9" strokeLinecap="round"/>
        </g>
      </svg>
  );
}

export default ArrowXSVG;