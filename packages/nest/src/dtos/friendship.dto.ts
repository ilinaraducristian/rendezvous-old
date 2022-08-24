import { IsNotEmpty, IsString } from "class-validator";

export class NewFriendshipDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}