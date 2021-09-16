import {useCallback, useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "DnDItemTypes";
import {moveChannels} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import DropHandleComponent from "components/DropHandle.component";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {useLazyMoveChannelQuery} from "../../state-management/apis/socketio.api";

type ComponentProps = {
  index: number,
  groupId: number | null
}

function ChannelDropHandleComponent({index, groupId}: ComponentProps) {

  const server = useAppSelector(selectSelectedServer);
  const [hidden, setHidden] = useState(true);
  const [fetchMoveChannel, {data: dataMoveChannel, isSuccess: isSuccessMoveChannel}] = useLazyMoveChannelQuery();
  const dispatch = useAppDispatch();

  const handleDrop = useCallback((item: { id: number, order: number, groupId: number | null }) => {
    if (server === undefined) return;
    fetchMoveChannel({serverId: server.id, channelId: item.id, order: index, groupId})
  }, [groupId, index, server, fetchMoveChannel]);

  useEffect(() => {
    if (!isSuccessMoveChannel || dataMoveChannel === undefined) return;
    dispatch(moveChannels(dataMoveChannel.channels));
  }, [dispatch, isSuccessMoveChannel, dataMoveChannel])

  const handleHover = useCallback(() => {
    setHidden(false);
  }, [setHidden]);

  const handleCollect = useCallback((monitor) => {
    return {
      isOver: monitor.isOver()
    };
  }, []);

  const [props, drop] = useDrop<ChannelDragObject, any, any>({
    accept: ItemTypes.CHANNEL,
    drop: handleDrop,
    hover: handleHover,
    collect: handleCollect
  }, [handleDrop, handleHover, handleCollect]);

  useEffect(() => {
    setHidden(!props.isOver);
  }, [props]);

  return <DropHandleComponent Hidden={hidden} ref={drop}/>;

}

export default ChannelDropHandleComponent;