import OverlayComponent from "components/overlay/Overlay.component";
import styled from "styled-components";
import {useCallback, useEffect} from "react";
import {addMessages, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedChannel} from "state-management/selectors/data.selector";
import {NewMessageRequest} from "../../dtos/message.dto";
import {useLazySendMessageQuery} from "../../state-management/apis/socketio";

type ComponentProps = {
  image: string
}

function ImageInputOverlayComponent({image}: ComponentProps) {

  const selectedChannel = useAppSelector(selectSelectedChannel);
  const [fetch, {data: message, isSuccess}] = useLazySendMessageQuery()
  const dispatch = useAppDispatch();

  const onClick = useCallback(async () => {
    if (selectedChannel === undefined) return;
    let payload: NewMessageRequest = {
      friendshipId: null,
      channelId: selectedChannel.id,
      text: "",
      isReply: false,
      replyId: null,
      image
    };
    fetch(payload);
  }, [image, selectedChannel, fetch]);

  useEffect(() => {
    if (!isSuccess || message === undefined) return;
    dispatch(addMessages([message]));
    dispatch(setOverlay(null));
  }, [isSuccess, message, dispatch])

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
