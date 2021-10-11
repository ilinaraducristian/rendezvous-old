const ItemTypes = {
  CHANNEL: "channel",
  GROUP: "group",
};

export type ChannelDragObject = {
  id: number,
  order: number,
  groupId: number | null
};

export type GroupDragObject = {
  id: number,
  order: number
};

export {ItemTypes};