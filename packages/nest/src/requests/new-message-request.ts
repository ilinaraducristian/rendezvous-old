import { IsArray } from "class-validator";
import { IsNotBlank } from "src/IsNotBlank";

class NewMessageRequest {
  @IsNotBlank()
  text: string;

  @IsArray()
  files: string[];
}

export default NewMessageRequest;
