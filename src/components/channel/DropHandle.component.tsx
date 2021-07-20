import {useDrop} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "../../DnDItemTypes";
import {useCallback, useContext, useEffect, useState} from "react";
import {Actions, GlobalStates} from "../../global-state";

type ComponentProps = {
  index: number,
  groupId: number | null
}

function DropHandleComponent({index, groupId}: ComponentProps) {

  const [hidden, setHidden] = useState(true);
  const {state, dispatch} = useContext(GlobalStates);

  const handleDrop = useCallback((item, monitor) => {
    if (item.order === index || item.order + 1 === index) return;
    if (groupId === null) return;

    if (item.order < index) {
      let newChannels = state.channels.filter(channel => channel.groupId === groupId).map(channel => {

        if (channel.order > item.order)
          channel.order--;
        if (channel.order >= index - 1)
          channel.order++;
        return channel;
      });

      const channel = newChannels.get(item.id);
      if (channel !== undefined) {
        channel.order = index - 1;
      }

      dispatch({type: Actions.CHANNELS_SET, payload: newChannels.clone()});
    } else {
      let newChannels = state.channels.filter(channel => channel.groupId === groupId).map(channel => {
        if (channel.order > item.order)
          channel.order--;
        if (channel.order >= index)
          channel.order++;
        return channel;
      });

      const channel = newChannels.get(item.id);
      if (channel !== undefined) {
        channel.order = index;
      }

      dispatch({type: Actions.CHANNELS_SET, payload: newChannels.clone()});
    }

  }, [dispatch, groupId, index, state.channels]);

  const handleHover = useCallback(() => {
    setHidden(false);
  }, []);

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

export default DropHandleComponent;