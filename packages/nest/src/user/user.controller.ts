import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AuthenticatedUser } from "src/types";
import { ExtractAuthenticatedUser } from "src/util";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("friendships")
  createFriendship(@ExtractAuthenticatedUser() user: AuthenticatedUser, @Body() friend: { id: string }) {
    if(user.id === friend.id) throw new Error('');
    return this.userService.createFriendship(user.id, friend.id);
  }

  @Get("friendships")
  getFriendships(@ExtractAuthenticatedUser() user: AuthenticatedUser) {
    return this.userService.getFriendships(user.id);
  }

  @Post("friendships/:id/messages")
  createFriedshipMessage(@ExtractAuthenticatedUser() user: AuthenticatedUser, @Param('id') id: string, @Body() newMessage: {text: string}) {
    return this.userService.createFriendshipMessage(user.id, id, newMessage.text);
  }

  @Get("friendships/:id/messages")
  getFriedshipMessages(@ExtractAuthenticatedUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.userService.getFriedshipMessages(user.id, id);
  }

}
