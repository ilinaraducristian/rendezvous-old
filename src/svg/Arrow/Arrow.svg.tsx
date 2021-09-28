import styles from "svg/Arrow/Arrow.module.css";
import {SVGProps} from "react";

type ComponentProps = SVGProps<SVGSVGElement> & { isCollapsed?: boolean };

function ArrowSVG({isCollapsed = true, className, ...props}: ComponentProps) {

    return (
        <svg viewBox="0 0 24 24"
             className={`${styles.svgArrow} ${isCollapsed ? styles.svgArrowCollapsed : ""} ${className ?? ""}`} {...props}>
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd"
                  d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"
            />
        </svg>
    );

}

function ArrowXSVG({isCollapsed = true, className, ...props}: ComponentProps) {
    return (
        <svg viewBox="0 0 24 24"
             className={`${styles.svgArrow} ${isCollapsed ? styles.svgArrowCollapsed : ""} ${className ?? ""}`} {...props}>
            <g fill="none" fillRule="evenodd">
                <path d="M0 0h18v18H0"/>
                <path stroke="currentColor" d="M4.5 4.5l9 9" strokeLinecap="round"/>
                <path stroke="currentColor" d="M13.5 4.5l-9 9" strokeLinecap="round"/>
            </g>
        </svg>
    );
}

export {ArrowSVG, ArrowXSVG};