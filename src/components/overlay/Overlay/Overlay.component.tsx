import {ReactNode} from "react";
import XSVG from "svg/XSVG/X.svg";
import {useAppDispatch} from "state-management/store";
import {setOverlay} from "state-management/slices/data/data.slice";
import styles from "./Overlay.module.css";
import ButtonComponent from "components/ButtonComponent";

type ComponentProps = {
    title?: string,
    description?: string,
    children?: ReactNode;
}

function OverlayComponent({title, description, children}: ComponentProps) {

    const dispatch = useAppDispatch();

    function closeOverlay() {
        dispatch(setOverlay(null));
    }

    return (
        <div className={styles.divOverlay}>
            <div className={styles.divContainer}>
                <ButtonComponent className={styles.button} onClick={closeOverlay}>
                    <XSVG/>
                </ButtonComponent>
                <header className={styles.header}>
                    {
                        title === undefined ||
                        <h1>{title}</h1>
                    }
                    {
                        description === undefined ||
                        <h5>{description}</h5>
                    }
                </header>
                {children}
            </div>
        </div>
    );
}

export default OverlayComponent;