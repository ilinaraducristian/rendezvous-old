import {useCallback, useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import ItemTypes, {ChannelDragObject} from "types/DnDItemTypes";
import {moveChannels} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {moveChannel} from "providers/socketio";
import DropHandleComponent from "components/DropHandle/DropHandle.component";
import {DropTargetMonitor} from "react-dnd/dist/types/types";

type ComponentProps = {
    index: number,
    groupId: number | null
}

function ChannelDropHandleComponent({index, groupId}: ComponentProps) {

    const server = useAppSelector(selectSelectedServer);
    const [hidden, setHidden] = useState(true);

    const dispatch = useAppDispatch();

    const handleDrop = useCallback(async (item: ChannelDragObject) => {
        if (server === undefined) return;
        const dataMoveChannel = await moveChannel({serverId: server.id, channelId: item.id, order: index, groupId});
        dispatch(moveChannels(dataMoveChannel.channels));
    }, [groupId, index, server, dispatch]);

    const handleHover = useCallback(() => {
        setHidden(false);
    }, [setHidden]);

    const handleCollect = useCallback((monitor: DropTargetMonitor) => {
        return {
            isOver: monitor.isOver()
        };
    }, []);

    const [props, drop] = useDrop<ChannelDragObject, any, any>({
        accept: ItemTypes.CHANNEL,
        drop: handleDrop,
        hover: handleHover,
        collect: handleCollect,
    }, [handleDrop, handleHover, handleCollect]);

    useEffect(() => {
        setHidden(!props.isOver);
    }, [props]);

    return <DropHandleComponent hidden={hidden} ref={drop}/>;

}

export default ChannelDropHandleComponent;