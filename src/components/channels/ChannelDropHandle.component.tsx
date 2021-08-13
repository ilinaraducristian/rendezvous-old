import {useCallback, useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "../../DnDItemTypes";
import {selectSelectedServer, setChannelsOrder} from "../../state-management/slices/serversDataSlice";
import {useAppDispatch, useAppSelector} from "../../state-management/store";
import DropHandleComponent from "../DropHandle.component";

type ComponentProps = {
  index: number,
  groupId: number | null
}

function ChannelDropHandleComponent({index, groupId}: ComponentProps) {

  const server = useAppSelector(selectSelectedServer);
  const [hidden, setHidden] = useState(true);
  const dispatch = useAppDispatch();

  const handleDrop = useCallback((item: { id: number, order: number, groupId: number | null }) => {

    if (groupId === item.groupId) {
      // if channel moved inside the same group
      if (server === undefined) return;
      if (groupId === null) {
        if (item.order === index || item.order + 1 === index) return;
        // if the group is the default one
        const channels = server.channels.filter(channel => channel.id !== item.id).map(channel => ({
          id: channel.id,
          order: channel.order,
          groupId: null
        }));
        if (item.order < index) {
          channels.forEach(channel => {
            if (channel.order >= index) channel.order++;
          });
          channels.forEach(channel => {
            if (channel.order > item.order) channel.order--;
          });
        } else {
          channels.forEach(channel => {
            if (channel.order > item.order) channel.order--;
          });
          channels.forEach(channel => {
            if (channel.order >= index) channel.order++;
          });
        }
        channels.push({id: item.id, order: index, groupId});
        dispatch(setChannelsOrder(channels));
      } else {
        // if the group is some group
        const group = server.groups.find(group => group.id === groupId);
        if (group === undefined) return;
        const channels = group.channels.filter(channel => channel.id !== item.id)
            .map(channel => ({id: channel.id, order: channel.order, groupId}));
        if (item.order < index) {
          channels.forEach(channel => {
            if (channel.order >= index) channel.order++;
          });
          channels.forEach(channel => {
            if (channel.order > item.order) channel.order--;
          });
        } else {
          channels.forEach(channel => {
            if (channel.order > item.order) channel.order--;
          });
          channels.forEach(channel => {
            if (channel.order >= index) channel.order++;
          });
        }
        console.log(index);
        channels.push({id: item.id, order: index, groupId});
        dispatch(setChannelsOrder(channels));
      }
    } else {
      // if channel moved to another group
    }


  }, [groupId, index, dispatch, server]);

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