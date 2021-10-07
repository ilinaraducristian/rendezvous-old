import styles from "./DropHandle.module.css";
import {DetailedHTMLProps, HTMLAttributes} from "react";

function DropHandleComponent({
                                 className,
                                 children,
                                 hidden,
                                 ...props
                             }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { hidden: boolean }) {

    return (
        <div className={`${styles.div} ${!hidden || styles.hidden} ${className ?? ""}`} {...props}>
            {children}
        </div>
    );

}

export default DropHandleComponent;