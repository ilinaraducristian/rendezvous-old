import {useCallback, useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "../../DnDItemTypes";
import {selectGroups} from "../../state-management/slices/serversDataSlice";
import {useAppSelector} from "../../state-management/store";

type ComponentProps = {
  index: number,
  groupId: number | null
}

function ChannelDropHandleComponent({index, groupId}: ComponentProps) {

  const groups = useAppSelector(selectGroups);
  const [hidden, setHidden] = useState(true);
  // const dispatch = useAppDispatch();

  const handleDrop = useCallback((item) => {
    if (item.order === index || item.order + 1 === index) return;
    if (groupId === null) return;
    if (groups === undefined) return;

    if (item.order < index) {

      let newChannels = groups.find(group => group.id === groupId)?.channels.map(channel => {

        if (channel.order > item.order)
          channel.order--;
        if (channel.order >= index - 1)
          channel.order++;
        return channel;
      });

      const channel = newChannels?.find(channel => channel.id === item.id);
      if (channel !== undefined) {
        channel.order = index - 1;
      }

      // dispatch(addChannels(newChannels));
    } else {
      let newChannels = groups.find(group => group.id === groupId)?.channels.map(channel => {
        if (channel.order > item.order)
          channel.order--;
        if (channel.order >= index)
          channel.order++;
        return channel;
      });

      const channel = newChannels?.find(channel => channel.id === item.id);
      if (channel !== undefined) {
        channel.order = index;
      }
      // dispatch(addChannels(newChannels));
    }

  }, [groupId, index, groups]);

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

  return <div className={"div__green-bar " + (hidden || "div__green-bar--active")} ref={drop}/>;

}

export default ChannelDropHandleComponent;