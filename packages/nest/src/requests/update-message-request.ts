import { IsNotBlank } from "../IsNotBlank";
import { ValidateIf } from "class-validator";

class UpdateMessageRequest {
  @ValidateIf((_, val) => val !== undefined)
  @IsNotBlank()
  text?: string;
}

export default UpdateMessageRequest;
