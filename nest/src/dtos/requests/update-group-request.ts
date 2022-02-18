import { IsNumber, Min, ValidateIf } from "class-validator";
import { IsNotBlank } from "../../IsNotBlank";

class UpdateGroupRequest {
  @ValidateIf((_, val) => val !== undefined)
  @IsNotBlank()
  name?: string;

  @ValidateIf((_, val) => val !== undefined)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  order?: number;
}

export default UpdateGroupRequest;
