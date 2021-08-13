import styled from "styled-components";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";

type ComponentProps = {
  shortcut: string | null
}

const emojis = [
  {emoji: String.fromCodePoint(0x1F600), shortcut: "grinning_face"},
  {emoji: String.fromCodePoint(0x1F603), shortcut: "grinning_face_with_big_eyes"},
  {emoji: String.fromCodePoint(0x1F604), shortcut: "grinning_face_with_smiling_eyes"},
  {emoji: String.fromCodePoint(0x1F601), shortcut: "beaming_face_with_smiling_eyes"},
  {emoji: String.fromCodePoint(0x1F606), shortcut: "grinning_squinting_face"},
  {emoji: String.fromCodePoint(0x1F605), shortcut: "grinning_face_with_sweat"},
  {emoji: String.fromCodePoint(0x1F923), shortcut: "rolling_on_the_floor_laughing"},
  {emoji: String.fromCodePoint(0x1F602), shortcut: "face_with_tears_of_joy"},
  {emoji: String.fromCodePoint(0x1F642), shortcut: "slightly_smiling_face"},
  {emoji: String.fromCodePoint(0x1F643), shortcut: "upside-down_face"},
  {emoji: String.fromCodePoint(0x1FAE0), shortcut: "melting_face"},
  {emoji: String.fromCodePoint(0x1F609), shortcut: "winking_face"},
  {emoji: String.fromCodePoint(0x1F60A), shortcut: "smiling_face_with_smiling_eyes"},
  {emoji: String.fromCodePoint(0x1F607), shortcut: "smiling_face_with_halo"},
];

function compare(message: string) {
  return emojis.filter(emoji => emoji.shortcut.indexOf(message) === 0);
}

const EmojiContainerComponent = forwardRef(({shortcut}: ComponentProps, ref) => {


  const [curIndex, setCurIndex] = useState(0);
  const [result, setResult] = useState<any>();

  useEffect(() => {
    if (shortcut === null) {
      setResult(undefined);
      setCurIndex(0);
    } else {
      const temp = compare(shortcut);
      if (temp.length === 0) {
        setResult(undefined);
        setCurIndex(0);
      } else {
        setResult(temp);
      }
    }
  }, [shortcut]);

  useImperativeHandle(ref, () => ({
    move: (event: any) => {
      if (event.code === "ArrowDown") {
        if (curIndex + 1 === result.length) {
          setCurIndex(0);
        } else {
          setCurIndex(curIndex + 1);
        }
      } else if (event.code === "ArrowUp") {
        if (curIndex - 1 === -1) {
          setCurIndex(result.length - 1);
        } else {
          setCurIndex(curIndex - 1);
        }
      }
    },
    getEmoji: () => {
      if (result === undefined) return;
      return result[curIndex].emoji;
    }
  }));

  return (<>{
    result?.map((result: any, index: number) => (
        // @ts-ignore
        <Div key={result.shortcut} highlighted={index === curIndex}>
          <div>{result.emoji}</div>
          <div>{result.shortcut}</div>
        </Div>
    ))
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