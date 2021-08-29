import styled from "styled-components";
import {MouseEventHandler} from "react";

type ComponentProps = {
  name: string,
  onClick: MouseEventHandler<HTMLButtonElement>
}

function FirstPanelButtonComponent({name, onClick}: ComponentProps) {

    return (
        <Li className="li">
            <Button className="btn" type="button" onClick={onClick}>
                {name[0]}
            </Button>
        </Li>
    );

}

/* CSS */

export const Li = styled.li`
  display: flex;
  margin: 0.5em 0;
`;

const Button = styled.button`
  background-color: var(--color-secondary);
  border: thin solid var(--color-secondary);
  color: white;
  font-size: 1.5rem;
  border-radius: 50%;
  width: 2em;
  height: 2em;
`;

/* CSS */

export default FirstPanelButtonComponent;