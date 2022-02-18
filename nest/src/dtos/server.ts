import Group from "./group";
import Invitation from "./invitation";
import Member from "./member";

type Server = {
  id: string;
  name: string;
  invitation: Invitation | null;
  order: number;
  groups: Group[];
  members: Member[];
  emojis: string[];
};

export default Server;
