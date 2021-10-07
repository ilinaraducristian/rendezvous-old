import styles from "./Avatar.module.css";
import {DetailedHTMLProps, HTMLAttributes} from "react";

function AvatarSVG({
                       className,
                       children,
                       url,
                       isActive,
                       ...props
                   }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { url: any, isActive: boolean }) {
    return (
        <div className={`${styles.div} ${!isActive || styles.isActive} ${className ?? ""}`}
             style={{backgroundImage: `url(${url})`}} {...props}>
            {children}
        </div>
    );
}

export default AvatarSVG;