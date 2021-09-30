import {useState} from "react";
import ChannelsListComponent from "components/channel/ChannelsList.component";
import {ArrowSVG} from "svg/Arrow/Arrow.svg";
import {setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import {OverlayTypes} from "types/UISelectionModes";
import ButtonComponent from "components/ButtonComponent";
import styles from "./Group.module.css";

type ComponentProps = {
    id: number,
    name: string
}

function GroupComponent({id, name}: ComponentProps) {

    const [isCollapsed, setIsExpanded] = useState(true);
    const dispatch = useAppDispatch();


    function createChannel() {
        dispatch(setOverlay({type: OverlayTypes.CreateChannelOverlayComponent, payload: {groupId: id}}));
    }

    return (
        <li>
            <div className={styles.div}>
                <ButtonComponent className={styles.button} onClick={() => setIsExpanded(!isCollapsed)}>
                    <ArrowSVG isCollapsed={isCollapsed}/>
                    <span>{name}</span>
                </ButtonComponent>
                <ButtonComponent className={styles.buttonCreateChannel} onClick={createChannel}>+</ButtonComponent>
            </div>
            {
                isCollapsed ||
                <ol className="list">
                    <ChannelsListComponent groupId={id}/>
                </ol>
            }
        </li>
    );

}

export default GroupComponent;

