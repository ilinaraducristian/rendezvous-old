import { makeAutoObservable } from "mobx";
import { fetchApi } from "../api";
import { ChannelType } from "../dtos/channel";
import GroupDto from "../dtos/group";
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
    await fetchApi(`servers/${this.serverId}/groups/${this.id}`, "DELETE");
  }

  async apiNewChannel(name: string, type: ChannelType) {
    await fetchApi(`servers/${this.serverId}/groups/${this.id}/channels`, "POST", { name, type });
  }
}

export default Group;
