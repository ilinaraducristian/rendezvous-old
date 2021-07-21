import {useDrop} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "../../DnDItemTypes";
import {useCallback, useContext, useEffect, useState} from "react";
import {GlobalStates} from "../../global-state";

type ComponentProps = {
  index: number
}

function GroupDropHandleComponent({index}: ComponentProps) {

  const [hidden, setHidden] = useState(true);
  const {state, dispatch} = useContext(GlobalStates);

  const handleDrop = useCallback((item, monitor) => {
  }, [dispatch, index]);

  const handleHover = useCallback(() => {
    setHidden(false);
  }, []);

  const handleCollect = useCallback((monitor) => {
    return {
      isOver: monitor.isOver()
    };
  }, []);

  const [props, drop] = useDrop<ChannelDragObject, any, any>({
    accept: ItemTypes.GROUP,
    drop: handleDrop,
    hover: handleHover,
    collect: handleCollect
  }, [handleDrop, handleHover, handleCollect]);

  useEffect(() => {
    setHidden(!props.isOver);
  }, [props]);

  return <div className={"div__green-bar " + (hidden || "div__green-bar--active")} ref={drop}/>;

}

export default GroupDropHandleComponent;