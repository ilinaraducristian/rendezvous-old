import { IsDecimal, IsMongoId, IsNumber, Min, ValidateIf } from "class-validator";
import { IsNotBlank } from "../IsNotBlank";

class UpdateChannelRequest {
  @ValidateIf((_, val) => val !== undefined)
  @IsNotBlank()
  name?: string;

  @ValidateIf((o, val) => val !== undefined && o.order !== undefined)
  @IsMongoId()
  groupId?: string | null;

  @ValidateIf((o, val) => val !== undefined && o.groupId !== undefined)
  @IsNumber()
  @IsDecimal()
  @Min(0)
  order?: number;
}

export default UpdateChannelRequest;
