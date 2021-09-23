import styled from "styled-components";
import {MouseEventHandler, ReactNode, useEffect, useState} from "react";

type ComponentProps = {
    selected: boolean,
    children?: ReactNode,
    onClick: MouseEventHandler<HTMLButtonElement>
}

function FirstPanelButtonComponent({selected, children, onClick}: ComponentProps) {

    const [selectedClass, setSelectedClass] = useState('');
    const [notchClass, setNotchClass] = useState('');

    useEffect(() => {
        if (selected) {
            setSelectedClass('btn__first-panel--selected');
            setNotchClass('div__first-panel-notch--selected');
        } else {
            setSelectedClass('');
            setNotchClass('');
        }
    }, [selected])

    return (
        <Li>
            <Div className={notchClass}/>
            <Button className={`btn ${selectedClass}`} type="button" onClick={onClick}>
                {children}
            </Button>
        </Li>
    );

}

/* CSS */

export const Li = styled.li`
  display: flex;
  margin: 8px 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &:hover > div {
    opacity: 1;
  }
`;

const Div = styled.div`
  height: 16px;
  background-color: white;
  width: 5px;
  border-radius: 20%;
  border-right: solid white;
  opacity: 0;
`;

const Button = styled.button`
  background-color: var(--color-2nd);
  border: thin solid var(--color-2nd);
  margin-right: 8px;

  color: white;
  font-size: 24px;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  transition: background-color 300ms, border-radius 300ms;

  &:hover {
    background-color: var(--color-17th);
    border-radius: 30%;
  }

  @keyframes in {
    from {
      border-radius: 50%;
      background-color: var(--color-2nd);
    }
    to {
      border-radius: 30%;
      background-color: var(--color-17th);
    }
  }

  @keyframes out {
    from {
      border-radius: 30%;
      background-color: var(--color-17th);
    }
    to {
      border-radius: 50%;
      background-color: var(--color-2nd);
    }
  }

`;

/* CSS */

export default FirstPanelButtonComponent;