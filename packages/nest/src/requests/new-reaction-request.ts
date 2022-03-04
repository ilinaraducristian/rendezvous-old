import { IsNotBlank } from "../IsNotBlank";

class NewReactionRequest {
  @IsNotBlank()
  userId: string;

  serverEmoji?: boolean;

  @IsNotBlank()
  emoji: string;
}

export default NewReactionRequest;
