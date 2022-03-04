import { MemberDto } from "@rendezvous/common";
import { makeAutoObservable } from "mobx";

class Member {
  id: string;
  serverId: string;
  userId: string;

  constructor(memberDto: MemberDto) {
    this.id = memberDto.id;
    this.serverId = memberDto.serverId;
    this.userId = memberDto.userId;
    makeAutoObservable(this);
  }
}

export default Member;
