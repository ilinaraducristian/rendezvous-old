import styled from "styled-components";
import {useCallback, useEffect} from "react";
import {addMessages, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedChannel} from "state-management/selectors/data.selector";
import {NewMessageRequest} from "../../dtos/message.dto";
import {useLazySendMessageQuery} from "../../state-management/apis/socketio.api";

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
        <TransparentBackground>
            <OverlayDiv>
                <MainDiv>
                    <Img src={image}/>
                    <FilenameSpan>unknown.png</FilenameSpan>
                    <UploadSpan>Upload to</UploadSpan>
                    <Span>ADD A COMMENT <OptionalSpan>(OPTIONAL)</OptionalSpan></Span>
                    <Input/>
                </MainDiv>
                <Footer>
                    <Button type="button" className="btn" onClick={onClick}>Upload</Button>
                </Footer>
            </OverlayDiv>
        </TransparentBackground>
    );

}

/* CSS */

const TransparentBackground = styled.div`
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-22th);
`;

const OverlayDiv = styled.div`
  width: 530px;
  height: 325px;
  display: flex;
  justify-content: start;
  align-items: end;
  flex-direction: column;
`;

const MainDiv = styled.div`
  --color: var(--color-2nd);
  background-color: var(--color);
  width: 100%;
  height: 247px;
  padding: 0 22px;
  display: flex;
  flex-direction: column;
  border: 0;
  border-top: solid var(--color);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  justify-content: end;
`;

const Span = styled.span`
  color: var(--color-6th);
`;

const UploadSpan = styled(Span)`
  margin-bottom: 24px;
`;

const FilenameSpan = styled(Span)`
  margin-top: 16px;
`;

const OptionalSpan = styled.span`
  color: var(--color-8th);
`;

const Input = styled.input`
  width: 486px;
  height: 44px;
  min-height: 44px;
  margin: 8px 0 18px;
`;

const Footer = styled.footer`
  --color: var(--color-3rd);
  background-color: var(--color);
  border: solid var(--color);
  border-radius: 0 0 5px 5px;
  width: 100%;
  display: flex;
  justify-content: end;
  height: 78px;
  border: 0;
`;

const Img = styled.img`
  max-width: 300px;
  max-height: 150px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
`;

const Button = styled.button`
  --color: var(--color-17th);
  background-color: var(--color);
  border: solid var(--color);
  width: 96px;
  height: 38px;
  border-radius: 3px;
  margin: 20px 20px 0 0;
  border: 0;
  transition: background-color 200ms, border 200ms;

  &:hover {
    --color: var(--color-20th);
  }

`;

/* CSS */

export default ImageInputOverlayComponent;
