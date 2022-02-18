import { IsString } from "class-validator";

class JoinServerRequest {
  @IsString()
  invitation: string;
}

export default JoinServerRequest;
