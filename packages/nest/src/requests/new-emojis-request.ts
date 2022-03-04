import { EmojiDto } from "@rendezvous/common";
import { IsArray } from "class-validator";

class NewEmojisRequest {
  @IsArray()
  emojis: EmojiDto[];
}

export default NewEmojisRequest;
