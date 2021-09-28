import {MouseEventHandler, ReactNode, useEffect, useState} from "react";
import styles from "components/first-panel/FirstPanelButton/FirstPanelButton.module.css";
import ButtonComponent from "components/ButtonComponent";

type ComponentProps = {
    selected: boolean,
    children?: ReactNode,
    onClick: MouseEventHandler<HTMLButtonElement>
}

function FirstPanelButtonComponent({selected, children, onClick}: ComponentProps) {

    const [selectedClass, setSelectedClass] = useState("");
    const [notchClass, setNotchClass] = useState("");

    useEffect(() => {
        if (selected) {
            setSelectedClass("btn__first-panel--selected");
            setNotchClass("div__first-panel-notch--selected");
        } else {
            setSelectedClass("");
            setNotchClass("");
        }
    }, [selected]);

    return (
        <li className={styles.li}>
            <div className={`${styles.div} ${notchClass}`}/>
            <ButtonComponent className={`${styles.button} ${selectedClass}`} onClick={onClick}>
                {children}
            </ButtonComponent>
        </li>
    );

}

export default FirstPanelButtonComponent;