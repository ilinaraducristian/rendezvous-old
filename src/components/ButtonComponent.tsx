import styled from "styled-components";
import {PropsWithChildren} from "react";

type ComponentProps = {
    children: PropsWithChildren<any>,
    as?: any
}

function ButtonComponent({children, as}: ComponentProps) {
    return (
        <Button type="button" className="btn" as={as}>
            {children}
        </Button>
    );
}

/* CSS */

const Button = styled.button``;

/* CSS */

export default ButtonComponent;