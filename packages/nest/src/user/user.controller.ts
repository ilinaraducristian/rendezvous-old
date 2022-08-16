import { Body, Controller, Get, Param, Sse } from "@nestjs/common";
import { filter, map, Observable } from "rxjs";
import { UserDocument } from "../entities/user.schema";
import { SseService } from "../sse.service";
import { ExtractAuthenticatedUser } from "../util";
import { UserService } from "./user.service";
import MessageEvent from "../message-event";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly sseService: SseService) { }

  @Get(":id")
  async getUser(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string) {
    const retrievedUser = await this.userService.getUser(id);
    return {
      name: retrievedUser.name
    }
  }

  @Get()
  async getUsers(@ExtractAuthenticatedUser() user: UserDocument, @Body() { users }: { users: string[] }) {
    const retrievedUsers = await this.userService.getUsers(users);
    return retrievedUsers.map(retrievedUser => ({
      name: retrievedUser.name
    }));
  }

  @Get('data')
  getUserData(@ExtractAuthenticatedUser() user: UserDocument) {
    return this.userService.getUserData(user);
  }

  @Sse('sse')
  sse(@ExtractAuthenticatedUser() user: UserDocument): Observable<MessageEvent> {
    return this.sseService.sse.pipe(filter(({ userId }) => userId === user.id), map(({ type, data }) => ({ type, data })));
  }

}
