import { IsHash } from "class-validator";
import { IsNotBlank } from "../IsNotBlank";

class UpdateEmojiRequest {
  @IsNotBlank()
  alias: string;

  @IsHash("md5")
  md5: string;
}

export default UpdateEmojiRequest;
