import {DetailedHTMLProps, HTMLAttributes} from "react";
import styles from "./TransparentBackgroundDiv.module.css";

function TransparentBackgroundDivComponent({
                                               className,
                                               children,
                                               ...props
                                           }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return (
        <div className={`${styles.div} ${className ?? ""}`} {...props}>
            <div>
                {children}
            </div>
        </div>
    );
}

export default TransparentBackgroundDivComponent;