import styled from "styled-components";
import {MouseEventHandler, useEffect, useState} from "react";
import {useAppSelector} from "../../state-management/store";
import {selectSecondPanelHeader, selectSelectedServer} from "../../state-management/selectors/data.selector";
import {SecondPanelHeaderTypes} from "../../types/UISelectionModes";

type ComponentProps = {
    name: string,
    serverId?: number,
    onClick: MouseEventHandler<HTMLButtonElement>
}

function FirstPanelButtonComponent({name, serverId, onClick}: ComponentProps) {

    const selectedServer = useAppSelector(selectSelectedServer);
    const secondPanelHeader = useAppSelector(selectSecondPanelHeader);
    const [selectedClass, setSelectedClass] = useState('');
    const [notchClass, setNotchClass] = useState('');

    useEffect(() => {
        if (
            (selectedServer !== undefined && serverId !== undefined && selectedServer.id === serverId) ||
            (name === "Home" && secondPanelHeader === SecondPanelHeaderTypes.friends)
        ) {
            setSelectedClass(' btn__first-panel--selected');
            setNotchClass('div__first-panel-notch--selected');
        } else {
            setSelectedClass('');
            setNotchClass('');
        }
    }, [selectedServer, serverId, name, secondPanelHeader])

    return (
        <Li className="li">
            <Div className={notchClass}/>
            <Button className={`btn${selectedClass}`} type="button" onClick={onClick}>
                {name[0]}
            </Button>
        </Li>
    );

}

/* CSS */

export const Li = styled.li`
  display: flex;
  margin: 0.5em 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &:hover > div {
    opacity: 1;
  }
`;

const Div = styled.div`
  height: 1em;
  background-color: white;
  width: 0.3em;
  border-radius: 20%;
  border-right: solid white;
  opacity: 0;
`;

const Button = styled.button`
  background-color: var(--color-2nd);
  border: thin solid var(--color-2nd);
  margin-right: 0.5em;

  color: white;
  font-size: 1.5rem;
  border-radius: 50%;
  width: 2em;
  height: 2em;
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