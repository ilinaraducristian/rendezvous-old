// @ts-ignore
import TrieSearch from "trie-search";

const trie = new TrieSearch([], {
  ignoreCase: false,
  splitOnRegEx: false,
  expandRegexes: [],
  min: 3
});


const emojis = [
  {id: 0, emoji: String.fromCodePoint(0x1F600), shortcut: "grinning_face"},
  {id: 1, emoji: String.fromCodePoint(0x1F603), shortcut: "grinning_face_with_big_eyes"},
  {id: 2, emoji: String.fromCodePoint(0x1F604), shortcut: "grinning_face_with_smiling_eyes"},
  {id: 3, emoji: String.fromCodePoint(0x1F601), shortcut: "beaming_face_with_smiling_eyes"},
  {id: 4, emoji: String.fromCodePoint(0x1F606), shortcut: "grinning_squinting_face"},
  {id: 5, emoji: String.fromCodePoint(0x1F605), shortcut: "grinning_face_with_sweat"},
  {id: 6, emoji: String.fromCodePoint(0x1F923), shortcut: "rolling_on_the_floor_laughing"},
  {id: 7, emoji: String.fromCodePoint(0x1F602), shortcut: "face_with_tears_of_joy"},
  {id: 8, emoji: String.fromCodePoint(0x1F642), shortcut: "slightly_smiling_face"},
  {id: 9, emoji: String.fromCodePoint(0x1F643), shortcut: "upside-down_face"},
  {id: 10, emoji: String.fromCodePoint(0x1FAE0), shortcut: "melting_face"},
  {id: 11, emoji: String.fromCodePoint(0x1F609), shortcut: "winking_face"},
  {id: 12, emoji: String.fromCodePoint(0x1F60A), shortcut: "smiling_face_with_smiling_eyes"},
  {id: 13, emoji: String.fromCodePoint(0x1F607), shortcut: "smiling_face_with_halo"},
];

emojis.forEach(emoji => {
  trie.map(`:${emoji.shortcut}`, emoji.emoji);
});

export {emojis};
export default trie;