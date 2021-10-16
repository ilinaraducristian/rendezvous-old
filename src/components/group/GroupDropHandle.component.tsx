import {useCallback, useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import ItemTypes, {GroupDragObject} from "types/DnDItemTypes";
import {moveGroups} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {moveGroup} from "providers/ReactSocketIO.provider";
import DropHandleComponent from "components/DropHandle/DropHandle.component";

type ComponentProps = {
    index: number
}

function GroupDropHandleComponent({index}: ComponentProps) {

    const server = useAppSelector(selectSelectedServer);
    const [hidden, setHidden] = useState(true);

    const dispatch = useAppDispatch();

    const handleDrop = useCallback(async (item: { id: number, order: number }) => {
        if (server === undefined) return;
        const dataMoveGroup = await moveGroup({serverId: server.id, groupId: item.id, order: index});
        dispatch(moveGroups(dataMoveGroup.groups));
    }, [index, server, dispatch]);

    const handleHover = useCallback(() => {
        setHidden(false);
    }, [setHidden]);

    const handleCollect = useCallback((monitor) => {
        return {
            isOver: monitor.isOver(),
        };
    }, []);

    const [props, drop] = useDrop<GroupDragObject, any, any>({
        accept: ItemTypes.GROUP,
        drop: handleDrop,
        hover: handleHover,
        collect: handleCollect,
    }, [handleDrop, handleHover, handleCollect]);

    useEffect(() => {
        setHidden(!props.isOver);
    }, [props]);

    return <DropHandleComponent hidden={hidden} ref={drop}/>;

}

export default GroupDropHandleComponent;