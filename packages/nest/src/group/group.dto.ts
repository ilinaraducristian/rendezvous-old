import { IsNotEmpty, IsString } from "class-validator";
import { GroupDocument } from "../entities/group.schema";

export class NewGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class JoinGroupDto {
  @IsString()
  @IsNotEmpty()
  invitation: string;
}

export class GroupDto {
  id: string;
  name: string;
  invitation: string;
  members: string[];

  constructor(groupDocument: GroupDocument) {
    this.id = groupDocument.id;
    this.name = groupDocument.name;
    this.invitation = groupDocument.invitation;
    this.members = groupDocument.members.map((memberId) => memberId.toString());
  }
}
