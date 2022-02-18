import { makeObservable, observable } from "mobx";
import { fetchJson } from "../api";
import ChannelDto, { ChannelType } from "../dtos/channel";
import { ChannelMessageDto } from "../dtos/message";
import { ChannelMessage } from "./message";
import MessagesParent from "./messages-parent";

class Channel extends MessagesParent<ChannelMessage> {
  serverId: string;
  groupId: string;
  name: string;
  order: number;
  type: ChannelType;

  constructor(channelDto: ChannelDto) {
    super(channelDto.id, `servers/${channelDto.serverId}/groups/${channelDto.groupId}/channels/${channelDto.id}`);
    this.serverId = channelDto.serverId;
    this.groupId = channelDto.groupId;
    this.name = channelDto.name;
    this.order = channelDto.order;
    this.type = channelDto.type;
    makeObservable(this, {
      serverId: observable,
      groupId: observable,
      name: observable,
      order: observable,
      type: observable,
    });
  }

  async apiGetMessages(offset: number = 0): Promise<[string, ChannelMessage][]> {
    const response = await fetchJson<ChannelMessageDto[]>(`${this.url}/messages?offset=${offset}`);
    return response.map((messageDto) => [messageDto.id, new ChannelMessage(messageDto)]);
  }
}

export default Channel;
