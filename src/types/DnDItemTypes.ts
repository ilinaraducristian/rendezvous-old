const ItemTypes = {
    CHANNEL: "channel",
    GROUP: "group",
    SERVER: "server",
};

export type DragObject = {
    id: number,
    order: number
};

export type ServerDragObject = DragObject;
export type GroupDragObject = DragObject;
export type ChannelDragObject = DragObject & {
    groupId: number | null
};

export default ItemTypes;