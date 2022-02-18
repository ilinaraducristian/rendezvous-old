import { makeAutoObservable } from "mobx";
import { fetchApi, fetchJson } from "../api";
import InvitationDto from "../dtos/invitation";
import ServerDto from "../dtos/server";
import OrderedMap from "../ordered-map";
import Group from "./group";
import Invitation from "./invitation";
import Member from "./member";

class Server {
  id: string;
  name: string;
  invitation: Invitation | null;
  order: number;
  groups: OrderedMap<string, Group>;
  members: OrderedMap<string, Member>;
  emojis: string[];

  constructor(serverDto: ServerDto) {
    this.id = serverDto.id;
    this.name = serverDto.name;
    this.invitation = serverDto.invitation === null ? null : new Invitation(serverDto.invitation);
    this.order = serverDto.order;
    this.groups = new OrderedMap(serverDto.groups.map((groupDto) => [groupDto.id, new Group(groupDto)]));
    this.members = new OrderedMap(serverDto.members.map((memberDto) => [memberDto.id, new Member(memberDto)]));
    this.emojis = serverDto.emojis;
    makeAutoObservable(this);
  }

  addGroup(id: string, group: Group) {
    this.groups.set(id, group);
  }

  removeGroup(id: string) {
    this.groups.delete(id);
  }

  addMember(id: string, member: Member) {
    this.members.set(id, member);
  }

  removeMember(id: string) {
    this.members.delete(id);
  }

  async apiDelete() {
    await fetchApi(`servers/${this.id}`, "DELETE");
  }

  async apiNewGroup(name: string) {
    await fetchApi(`servers/${this.id}/groups`, "POST", { name });
  }

  async apiLeave() {
    await fetchApi(`users/servers/${this.id}`, "DELETE");
  }

  async apiNewInvitation(): Promise<string> {
    const invitationDto = await fetchJson<InvitationDto>(`servers/${this.id}/invitations`, "POST", {});
    this.invitation = new Invitation(invitationDto);
    return this.invitation.link;
  }
}

export default Server;
