import {useCallback, useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import ItemTypes, {ServerDragObject} from "types/DnDItemTypes";
import {useAppDispatch} from "state-management/store";
import DropHandleComponent from "components/DropHandle/DropHandle.component";
import {moveServer} from "providers/ReactSocketIO.provider";
import {moveServers} from "state-management/slices/data/data.slice";

type ComponentProps = {
    index: number
}

function ServerDropHandleComponent({index}: ComponentProps) {

    const [hidden, setHidden] = useState(true);

    const dispatch = useAppDispatch();

    const handleDrop = useCallback(async (item: ServerDragObject) => {
        console.log({serverId: item.id, order: index});
        const dataMoveServer = await moveServer({serverId: item.id, order: index});
        dispatch(moveServers(dataMoveServer.servers));
    }, [index, dispatch]);

    const handleHover = useCallback(() => {
        setHidden(false);
    }, [setHidden]);

    const handleCollect = useCallback((monitor) => {
        return {
            isOver: monitor.isOver(),
        };
    }, []);

    const [props, drop] = useDrop<ServerDragObject, any, any>({
        accept: ItemTypes.SERVER,
        drop: handleDrop,
        hover: handleHover,
        collect: handleCollect,
    }, [handleDrop, handleHover, handleCollect]);

    useEffect(() => {
        setHidden(!props.isOver);
    }, [props]);

    return <DropHandleComponent hidden={hidden} ref={drop}/>;

}

export default ServerDropHandleComponent;