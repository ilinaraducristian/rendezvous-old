import {SVGProps} from "react";
import styles from "svg/Check/Check.module.css";

function CheckSVG({className, ...props}: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" className={`${styles.svg} ${className ?? ""}`} {...props}>
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd"
                  d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"/>
        </svg>
    );
}

export default CheckSVG;