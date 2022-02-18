import { IsArray } from "class-validator";
import Emoji from "../emoji";

class NewEmojisRequest {
  @IsArray()
  emojis: Emoji[];
}

export default NewEmojisRequest;
