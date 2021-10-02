import {SecondPanelHeaderTypes} from "types/UISelectionModes";
import {useAppSelector} from "state-management/store";
import {selectSecondPanelHeader, selectSelectedServer} from "state-management/selectors/data.selector";
import {Dispatch, SetStateAction} from "react";
import {ArrowXSVG} from "svg/Arrow/Arrow.svg";
import FriendSVG from "svg/Friend/Friend.svg";
import styles from "components/second-panel/SecondPanelHeader/SecondPanelHeader.module.css";
import ButtonComponent from "components/ButtonComponent";

type ComponentProps = {
    isDropdownShown: boolean,
    setIsDropdownShown: Dispatch<SetStateAction<boolean>>;
}

function SecondPanelHeaderComponent({isDropdownShown, setIsDropdownShown}: ComponentProps) {

    const selectedServer = useAppSelector(selectSelectedServer);
    const secondPanelHeader = useAppSelector(selectSecondPanelHeader);

    function toggleDropdown() {
        if (selectedServer === undefined) return;
        setIsDropdownShown(!isDropdownShown);
    }

    return (
        <header className={styles.secondPanelHeader}>
            {
                secondPanelHeader !== SecondPanelHeaderTypes.channel || selectedServer === undefined ||
                <ButtonComponent className={styles.button} onClick={toggleDropdown}>
                    <span className={styles.span}>{selectedServer.name}</span>
                    <ArrowXSVG isCollapsed={!isDropdownShown}/>
                </ButtonComponent>
            }
            {
                secondPanelHeader !== SecondPanelHeaderTypes.friends ||
                <ButtonComponent className={styles.friendsButton}>
                    <FriendSVG/>
                    <span className={styles.span}>Friends</span>
                </ButtonComponent>
            }
        </header>
    );
}

export default SecondPanelHeaderComponent;