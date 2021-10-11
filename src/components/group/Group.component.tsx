import {DetailedHTMLProps, LiHTMLAttributes, useState} from "react";
import ChannelsListComponent from "components/channel/ChannelsList.component";
import {ArrowSVG} from "svg/Arrow/Arrow.svg";
import {setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import {OverlayTypes} from "types/UISelectionModes";
import ButtonComponent from "components/ButtonComponent";
import styles from "./Group.module.css";
import {useDrag} from "react-dnd";
import {GroupDragObject, ItemTypes} from "types/DnDItemTypes";
import {Group} from "dtos/group.dto";

type ComponentProps = DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> & {
    group: Group
}

function GroupComponent({group, ...props}: ComponentProps) {

    const [isCollapsed, setIsExpanded] = useState(true);
    const dispatch = useAppDispatch();


    function createChannel() {
        dispatch(setOverlay({
            type: OverlayTypes.CreateChannelOverlayComponent,
            payload: {groupId: group.id, groupName: group.name},
        }));
    }

    const [, drag] = useDrag<GroupDragObject, any, any>({
        type: ItemTypes.GROUP,
        item: {id: group.id, order: group.order},
    }, [group]);

    return (
        <li ref={drag} {...props}>
            <div className={styles.div}>
                <ButtonComponent className={styles.button} onClick={() => setIsExpanded(!isCollapsed)}>
                    <ArrowSVG isCollapsed={isCollapsed}/>
                    <span>{group.name}</span>
                </ButtonComponent>
                <ButtonComponent className={styles.buttonCreateChannel} onClick={createChannel}>+</ButtonComponent>
            </div>
            {
                isCollapsed ||
                <ol className="list">
                    <ChannelsListComponent groupId={group.id}/>
                </ol>
            }
        </li>
    );

}

export default GroupComponent;

