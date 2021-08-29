import OverlayComponent from "components/overlay/Overlay.component";
import styled from "styled-components";
import {useCallback} from "react";
import socket from "socketio";
import {addMessages, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedChannel} from "state-management/selectors/data.selector";

type ComponentProps = {
  image: string
}

function ImageInputOverlayComponent({image}: ComponentProps) {

  const selectedChannel = useAppSelector(selectSelectedChannel);
  const dispatch = useAppDispatch();

  const onClick = useCallback(async () => {
    if (selectedChannel === undefined) return;
    let payload: {
      channelId: number,
      message: string,
      isReply: boolean,
      replyId: number | null,
      image: string | null
    } = {
      channelId: selectedChannel.id,
      message: "",
      isReply: false,
      replyId: null,
      image
    };
    let message = await socket.emitAck("send_message", payload);
    dispatch(addMessages([message]));
    dispatch(setOverlay(null));
  }, [dispatch, image, selectedChannel]);

  return (
      <OverlayComponent>
        <Img src={image}/>
        <button type="button" onClick={onClick}>Upload</button>
      </OverlayComponent>
  );

}

/* CSS */

const Img = styled.img`
  max-width: 5rem;
`;

/* CSS */

export default ImageInputOverlayComponent;
