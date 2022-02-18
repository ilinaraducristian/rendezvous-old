import { ValidateIf } from "class-validator";
import { IsNotBlank } from "../../IsNotBlank";

class UpdateServerRequest {
  @ValidateIf((_, val) => val !== undefined)
  @IsNotBlank()
  name?: string;
}

export default UpdateServerRequest;
