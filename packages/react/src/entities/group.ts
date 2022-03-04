import { ChannelTypeDto, GroupDto } from "@rendezvous/common";
import { makeAutoObservable } from "mobx";
import { fetchAuthApi } from "../api";
import OrderedMap from "../ordered-map";
import Channel from "./channel";

class Group {
  id: string;
  serverId: string;
  name: string;
  order: number;
  channels: OrderedMap<string, Channel>;

  constructor(groupDto: GroupDto) {
    this.id = groupDto.id;
    this.serverId = groupDto.serverId;
    this.name = groupDto.name;
    this.order = groupDto.order;
    this.channels = new OrderedMap(groupDto.channels.map((channelDto) => [channelDto.id, new Channel(channelDto)]));
    makeAutoObservable(this);
  }

  addChannel(id: string, channel: Channel) {
    this.channels.set(id, channel);
  }

  removeChannel(id: string) {
    this.channels.delete(id);
  }

  async apiDelete() {
    await fetchAuthApi(`servers/${this.serverId}/groups/${this.id}`, {method: "DELETE"});
  }

  async apiNewChannel(name: string, type: ChannelTypeDto) {
    await fetchAuthApi(`servers/${this.serverId}/groups/${this.id}/channels`, {method: "POST", body: { name, type }});
  }
}

export default Group;
