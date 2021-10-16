import {DetailedHTMLProps, forwardRef, LiHTMLAttributes, MouseEventHandler, useEffect, useState} from "react";
import styles from "components/first-panel/FirstPanelButton/FirstPanelButton.module.css";
import ButtonComponent from "components/ButtonComponent";

type ComponentProps = Omit<DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & {
    selected: boolean,
    onClick: MouseEventHandler<HTMLButtonElement>
};

const FirstPanelButtonComponent = forwardRef<HTMLLIElement, ComponentProps>(
    ({selected, children, onClick, ...props}, ref) => {

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
            <li className={styles.li} ref={ref} {...props}>
                <div className={`${styles.div} ${notchClass}`}/>
                <ButtonComponent className={`${styles.button} ${selectedClass}`} onClick={onClick}>
                    {children}
                </ButtonComponent>
            </li>
        );

    });

export default FirstPanelButtonComponent;