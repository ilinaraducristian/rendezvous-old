import { IsNotBlank } from "../../IsNotBlank";

class NewGroupRequest {
  @IsNotBlank()
  name: string;
}

export default NewGroupRequest;
