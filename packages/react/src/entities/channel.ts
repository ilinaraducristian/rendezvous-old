import { ChannelDto, ChannelMessageDto, ChannelTypeDto } from "@rendezvous/common";
import { makeObservable, observable } from "mobx";
import { fetchAuthApi, fetchAuthApiJson } from "../api";
import { ChannelMessage } from "./message";
import MessagesParent from "./messages-parent";

class Channel extends MessagesParent<ChannelMessage> {
  serverId: string;
  groupId: string;
  name: string;
  order: number;
  type: ChannelTypeDto;
  users?: string[]

  constructor(channelDto: ChannelDto) {
    super(channelDto.id, `servers/${channelDto.serverId}/groups/${channelDto.groupId}/channels/${channelDto.id}`);
    this.serverId = channelDto.serverId;
    this.groupId = channelDto.groupId;
    this.name = channelDto.name;
    this.order = channelDto.order;
    this.type = channelDto.type;
    this.users = channelDto.users;
    makeObservable(this, {
      serverId: observable,
      groupId: observable,
      name: observable,
      order: observable,
      type: observable,
      users: observable
    });
  }

  async apiGetMessages(offset: number = 0): Promise<[string, ChannelMessage][]> {
    const response = await fetchAuthApiJson<ChannelMessageDto[]>(`${this.url}/messages?offset=${offset}`);
    return response.map((messageDto) => [messageDto.id, new ChannelMessage(messageDto)]);
  }

  async joinChannel() {
    if(this.type === ChannelTypeDto.text) return;
    await fetchAuthApi(`servers/${this.serverId}/groups/${this.groupId}/channels/${this.id}/users`, {method: "POST", body: {}});
  }

}

export default Channel;
