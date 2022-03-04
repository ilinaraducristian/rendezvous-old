import { ChannelTypeDto } from "@rendezvous/common";
import { IsEnum } from "class-validator";
import { IsNotBlank } from "src/IsNotBlank";

class NewChannelRequest {
  @IsNotBlank()
  name: string;

  @IsEnum(ChannelTypeDto)
  type: ChannelTypeDto;
}

export default NewChannelRequest;
