import styled from "styled-components";
import {ClipboardEvent, useCallback} from "react";

type ComponentProps = {
  onKeyDown: any,
  onKeyUp: any,
  onClick: any
}

function MessageInputComponent({onKeyDown, onKeyUp, onClick}: ComponentProps) {

  const onCopy = useCallback((event: ClipboardEvent<HTMLSpanElement>) => {
    event.preventDefault();
    const selection = getSelection();
    const clipboard = event.clipboardData;
    if (selection === null || clipboard === null) return;
    clipboard.setData("text/plain", selection.toString());
  }, []);

  return (
      <Span
          role="textbox"
          contentEditable
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onCopy={onCopy}
          onClick={onClick}
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