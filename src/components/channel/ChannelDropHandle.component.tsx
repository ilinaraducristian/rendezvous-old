import {useDrop} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "../../DnDItemTypes";
import {useCallback, useContext, useEffect, useState} from "react";
import {GlobalStates} from "../../state-management/global-state";
import Actions from "../../state-management/actions";

type ComponentProps = {
  index: number,
  groupId: number | null
}

function ChannelDropHandleComponent({index, groupId}: ComponentProps) {

  const [hidden, setHidden] = useState(true);
  const {state, dispatch} = useContext(GlobalStates);

  const handleDrop = useCallback((item) => {
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
      state.channels.concat(newChannels);
      dispatch({type: Actions.CHANNELS_SET, payload: state.channels});
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
      state.channels.concat(newChannels);
      dispatch({type: Actions.CHANNELS_SET, payload: state.channels.clone()});
    }

  }, [dispatch, groupId, index, state.channels]);

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