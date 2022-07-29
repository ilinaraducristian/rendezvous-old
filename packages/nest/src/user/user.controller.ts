import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserData } from "src/types";
import { AuthenticatedUser } from "src/util";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('data')
  async getUserData(@AuthenticatedUser() user: any): Promise<UserData> {
    return this.userService.getUserData(user.sub);
  }

  // @Post("friends")
  // createFriendship(@Body() friend: { id: string }, userId: string) {
  //   return this.userService.createFriendship(userId, friend.id);
  // }

  // @Delete("friends/:id")
  // deleteFriendship(@Param('id') id: string, userId: string) {
  //   return this.userService.deleteFriendship(id);
  // }

  // @Post("friends/:id/messages")
  // createMessage(@Param() id: string, @Body() message: { text: string }, userId: string) {
  //   return this.userService.createMessage(userId, id, message.text);
  // }

}
