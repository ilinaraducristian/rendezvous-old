import { Body, Controller, Get, Param } from "@nestjs/common";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async getUser(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string) {
    const retrievedUser = await this.userService.getUser(id);
    return {
      name: retrievedUser.name
    }
  }

  @Get("")
  async getUsers(@ExtractAuthenticatedUser() user: UserDocument, @Body() {users}: {users: string[]}) {
    const retrievedUsers = await this.userService.getUsers(users);
    return retrievedUsers.map(retrievedUser => ({
      name: retrievedUser.name
    }));
  }

}
