import {DetailedHTMLProps, HTMLAttributes} from "react";
import styles from "./TransparentBackgroundDiv.module.css";

function TransparentBackgroundDivComponent({
                                               children,
                                               className,
                                               ...props
                                           }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return (
        <div className={`${styles.div} ${className ?? ""}`} {...props}>
            {children}
        </div>
    );
}

export default TransparentBackgroundDivComponent;