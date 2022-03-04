import { IsNotBlank } from "src/IsNotBlank";

class NewGroupRequest {
  @IsNotBlank()
  name: string;
}

export default NewGroupRequest;
