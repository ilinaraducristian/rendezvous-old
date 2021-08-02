import {useCallback, useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "../../DnDItemTypes";

type ComponentProps = {
  index: number
}

function GroupDropHandleComponent({index}: ComponentProps) {

  const [hidden, setHidden] = useState(true);

  const handleDrop = useCallback(() => {
  }, []);

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