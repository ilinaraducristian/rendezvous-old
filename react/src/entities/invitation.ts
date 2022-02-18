import InvitationDto from "../dtos/invitation";

class Invitation {
  link: string;
  exp: Date;

  constructor(invitationDto: InvitationDto) {
    this.link = invitationDto.link;
    this.exp = invitationDto.exp;
  }
}

export default Invitation;
