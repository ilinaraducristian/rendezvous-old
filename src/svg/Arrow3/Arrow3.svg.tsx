import {SVGProps} from "react";

function Arrow3SVG({width, height, viewBox, ...props}: SVGProps<SVGSVGElement>) {
    return (
        <svg width={width ?? "24"} height={height ?? "24"} viewBox={viewBox ?? "0 0 24 24"} {...props}>
            <polygon fill="currentColor" fillRule="nonzero"
                     points="13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"/>
        </svg>
    );
}

export default Arrow3SVG;