import {ButtonHTMLAttributes, DetailedHTMLProps} from "react";

function ButtonComponent({
                             children,
                             className,
                             ...props
                         }: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button type="button" className={`btn ${className ?? " "}`} {...props}>
            {children}
        </button>
    );
}

export default ButtonComponent;