import {forwardRef, useImperativeHandle, useState} from "react";
import styles from "components/message/PopupContainer/PopupContainer.module.css";

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
                                                                                       selectElement,
                                                                                   }: ComponentProps, ref) => {

    const [selectedElementIndex, setSelectedElementIndex] = useState<number>(0);

    useImperativeHandle(ref, () => ({
        move(up: boolean) {
            if (up) {
                if (selectedElementIndex - 1 === -1) {
                    setSelectedElementIndex(elements.length - 1);
                } else {
                    setSelectedElementIndex(selectedElementIndex - 1);
                }
            } else {
                if (selectedElementIndex + 1 === elements.length) {
                    setSelectedElementIndex(0);
                } else {
                    setSelectedElementIndex(selectedElementIndex + 1);
                }
            }
        },
        getSelectedElement() {
            return elements[selectedElementIndex];
        },
    }));

    function onMouseEnter(index: number) {
        setSelectedElementIndex(index);
    }

    return (
        <div className={styles.div}>
            <span>{title}</span>
            <ul className={`list ${styles.ul}`}>
                {elements.map((element, index) =>
                    (
                        <li onMouseEnter={() => onMouseEnter(index)}
                            onMouseUp={(event) => {
                                event.preventDefault();
                                selectElement(element);
                            }}
                            className={`${styles.li} ${selectedElementIndex === index ? styles.liSelected : ""}`}
                            key={`popup-item_${index}`}
                        >
                            {element}
                        </li>
                    ))}
            </ul>
        </div>
    );

});

export default PopupContainerComponent;