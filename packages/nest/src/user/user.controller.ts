import { Body, Controller, Get, Param, Sse } from "@nestjs/common";
import { filter, Observable } from "rxjs";
import { UserDocument } from "../entities/user.schema";
import { SseService } from "../sse.service";
import { ExtractAuthenticatedUser } from "../util";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly sseService: SseService) {}

  @Get(":id")
  async getUser(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string) {
    const retrievedUser = await this.userService.getUser(id);
    return {
      name: retrievedUser.name
    }
  }

  @Get()
  async getUsers(@ExtractAuthenticatedUser() user: UserDocument, @Body() {users}: {users: string[]}) {
    const retrievedUsers = await this.userService.getUsers(users);
    return retrievedUsers.map(retrievedUser => ({
      name: retrievedUser.name
    }));
  }

  @Sse('sse')
  sse(@ExtractAuthenticatedUser() user: UserDocument): Observable<any> {
    return this.sseService.sse.pipe(filter(r => r.userId === user._id.toString()));
  }

}
