import styled from "styled-components";
import {ClipboardEvent, EventHandler, KeyboardEvent, MouseEvent, useCallback} from "react";
import {useAppDispatch} from "state-management/store";
import {setOverlay} from "state-management/slices/data/data.slice";

type ComponentProps = {
  onKeyDown: EventHandler<KeyboardEvent<HTMLSpanElement>>,
  onKeyUp: EventHandler<KeyboardEvent<HTMLSpanElement>>,
  onClick: EventHandler<MouseEvent<HTMLSpanElement>>;
}

function MessageInputComponent({onKeyDown, onKeyUp, onClick}: ComponentProps) {

  const dispatch = useAppDispatch();

  const onCopy = useCallback((event: ClipboardEvent<HTMLSpanElement>) => {
    event.preventDefault();
    const selection = getSelection();
    const clipboard = event.clipboardData;
    if (selection === null || clipboard === null) return;
    clipboard.setData("text/plain", selection.toString());
  }, []);

  const onPaste = useCallback((event: ClipboardEvent<HTMLSpanElement>) => {
    event.preventDefault();
    if (!event.clipboardData.types.includes("Files")) {
      document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
      return false;
    }
    let file;
    for (const item of event.clipboardData.items) {
      if (item.kind === "file") {
        file = event.clipboardData.items[0].getAsFile();
        break;
      }
    }
    if (file === undefined) return false;

    if (file === null) {
      return false;
    }
    const fr = new FileReader();
    fr.onloadend = () => {
      if (typeof fr.result !== "string") return;
      dispatch(setOverlay({type: "ImageInputOverlayComponent", payload: {image: fr.result}}));
    };
    fr.readAsDataURL(file);

  }, [dispatch]);

  return (
      <Span
          role="textbox"
          contentEditable
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onCopy={onCopy}
          onClick={onClick}
          onPaste={onPaste}
      />
  );
}

/* CSS */

const Span = styled.span`
  background: none;
  border: none;
  flex-grow: 1;
  word-wrap: anywhere;
  max-height: inherit;
  overflow-y: auto;
  align-self: center;

  &:focus {
    outline: none;
  }
`;

/* CSS */

export default MessageInputComponent;