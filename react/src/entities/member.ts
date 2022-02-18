import { makeAutoObservable } from "mobx";
import MemberDto from "../dtos/member";

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
