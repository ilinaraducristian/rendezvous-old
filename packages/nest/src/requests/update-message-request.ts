import { ValidateIf } from "class-validator";
import { IsNotBlank } from "../IsNotBlank";

class UpdateMessageRequest {
  @ValidateIf((_, val) => val !== undefined)
  @IsNotBlank()
  text?: string;
}

export default UpdateMessageRequest;
