import styles from "./DropHandle.module.css";
import {DetailedHTMLProps, forwardRef, HTMLAttributes} from "react";

type ComponentProps =
    Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref">
    & { hidden: boolean };

const DropHandleComponent = forwardRef<HTMLDivElement, ComponentProps>(
    ({
         className,
         children,
         hidden,
         ...props
     }, ref) => {
        return (
            <div className={`${styles.div} ${!hidden || styles.hidden} ${className ?? ""}`} ref={ref} {...props}>
                {children}
            </div>
        );
    });

export default DropHandleComponent;