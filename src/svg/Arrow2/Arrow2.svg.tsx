import styles from "./Arrow2.module.css";
import {SVGProps} from "react";

type ComponentProps = SVGProps<SVGSVGElement>;

function Arrow2SVG({className, width, height, viewBox, ...props}: ComponentProps) {

    return (
        <svg className={`${styles.svg} ${className ?? ""}`} width={width ?? "24"} height={height ?? "24"}
             viewBox={viewBox ?? "0 0 24 24"} {...props}>
            <path
                d="M10 8.26667V4L3 11.4667L10 18.9333V14.56C15 14.56 18.5 16.2667 21 20C20 14.6667 17 9.33333 10 8.26667Z"
                fill="currentColor"/>
        </svg>
    );

}


export default Arrow2SVG;