import { InvitationDto, ServerDto } from "@rendezvous/common";
import { makeAutoObservable } from "mobx";
import { fetchAuthApi, fetchAuthApiJson } from "../api";
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
    await fetchAuthApi(`servers/${this.id}`, {method: "DELETE"});
  }

  async apiNewGroup(name: string) {
    await fetchAuthApi(`servers/${this.id}/groups`, {method: "POST", body: { name }});
  }

  async apiLeave() {
    await fetchAuthApi(`users/servers/${this.id}`, {method: "DELETE"});
  }

  async apiNewInvitation(): Promise<string> {
    const invitationDto = await fetchAuthApiJson<InvitationDto>(`servers/${this.id}/invitations`, {method: "POST"});
    this.invitation = new Invitation(invitationDto);
    return this.invitation.link;
  }
}

export default Server;
