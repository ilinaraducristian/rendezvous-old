import styled from "styled-components";
import {forwardRef, useImperativeHandle, useState} from "react";
import {emojis} from "util/trie";

type ComponentProps = {
  foundEmojis: any[]
}

const EmojiContainerComponent = forwardRef(({foundEmojis}: ComponentProps, ref) => {

  const [curIndex, setCurIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    move: (up: boolean) => {
      if (up) {
        if (curIndex - 1 === -1) {
          setCurIndex(foundEmojis.length - 1);
        } else {
          setCurIndex(curIndex - 1);
        }
      } else {
        if (curIndex + 1 === foundEmojis.length) {
          setCurIndex(0);
        } else {
          setCurIndex(curIndex + 1);
        }
      }
    },
    getEmoji: () => {
      return foundEmojis[curIndex];
    }
  }));

  return (<>{
    foundEmojis.map((result: any, index: number) =>
        // @ts-ignore
        (<Div key={`emoji_${index}`} highlighted={index === curIndex}>
          <div>{result}</div>
          <div>{emojis.find(emoji => emoji.emoji === result)?.shortcut}</div>
        </Div>)
    )
  }</>);
});

/* CSS */

const Div = styled.div`
  display: flex;
  align-content: space-between;

  background-color: ${(props: any) => props.highlighted ? "blue" : "red"};
`;

/* CSS */

export default EmojiContainerComponent;