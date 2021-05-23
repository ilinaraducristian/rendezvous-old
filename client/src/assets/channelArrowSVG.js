export default function ChannelArrowSVG({tilted}) {
    return (
        <svg className={(tilted ? 'tilted' : '') + ' arrow'} width="12" height="12" viewBox="0 0 24 24">
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd"
                  d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z">/
            </path>
        </svg>
    );
}
