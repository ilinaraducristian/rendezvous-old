import styled from "styled-components";
import {forwardRef, useImperativeHandle, useState} from "react";

type ComponentProps<T = any> = {
    title: string,
    elements: T[],
    selectElement: (element: T) => void
}

export type PopupContainerRefType<T = any> = {
    move: (up: boolean) => void,
    getSelectedElement: () => T,
}

const PopupContainerComponent = forwardRef<PopupContainerRefType, ComponentProps>(({
                                                                                       title,
                                                                                       elements,
                                                                                       selectElement
                                                                                   }: ComponentProps, ref) => {

    const [selectedElementIndex, setSelectedElementIndex] = useState<number>(0);

    useImperativeHandle(ref, () => ({
        move(up: boolean) {
            if (up) {
                if (selectedElementIndex - 1 === -1) {
                    setSelectedElementIndex(elements.length - 1)
                } else {
                    setSelectedElementIndex(selectedElementIndex - 1)
                }
            } else {
                if (selectedElementIndex + 1 === elements.length) {
                    setSelectedElementIndex(0)
                } else {
                    setSelectedElementIndex(selectedElementIndex + 1)
                }
            }
        },
        getSelectedElement() {
            return elements[selectedElementIndex];
        }
    }));

    function onMouseEnter(index: number) {
        setSelectedElementIndex(index);
    }

    return (
        <Div>
            <span>{title}</span>
            <Ul className="list">
                {elements.map((element, index) =>
                    (
                        <Li onMouseEnter={() => onMouseEnter(index)}
                            onMouseUp={(event) => {
                                event.preventDefault();
                                selectElement(element)
                            }}
                            className={selectedElementIndex === index ? "selected-popup-item" : ""}
                            key={`popup-item_${index}`}
                        >
                            {element}
                        </Li>
                    ))}
            </Ul>
        </Div>
    )

});

const Div = styled.div`
  background-color: var(--color-third);
  margin: 0 1em 1em 1em;
  border: solid var(--color-third);
  border-radius: 0.5em;
  max-height: 22.375em;
  overflow-y: auto;
`

const Ul = styled.ul`
  margin: 1em;
`

const Li = styled.li`
  cursor: pointer;
  margin: 1em 0;
`

export default PopupContainerComponent;