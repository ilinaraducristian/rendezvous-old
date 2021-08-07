import styled from "styled-components";

const Div = styled.div`
  background-color: red;
  display: flex;
  align-content: space-between;
`;

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

function EmojiContainerComponent({shortcut}: ComponentProps) {
  let result: any;
  if (shortcut !== null)
    result = compare(shortcut);
  if (result?.length === 0)
    result = undefined;
  return (<>{
    result?.map((result: any) => (
        <Div key={result.shortcut}>
          <div>{result.emoji}</div>
          <div>{result.shortcut}</div>
        </Div>
    ))
  }</>);
}

export default EmojiContainerComponent;