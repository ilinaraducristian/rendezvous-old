import GroupDto from "./group";
import InvitationDto from "./invitation";
import MemberDto from "./member";

type ServerDto = {
  id: string;
  name: string;
  invitation: InvitationDto | null;
  order: number;
  groups: GroupDto[];
  members: MemberDto[];
  emojis: string[];
};

export default ServerDto;
