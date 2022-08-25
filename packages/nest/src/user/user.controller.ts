import { Body, Controller, Get, Param, Sse } from "@nestjs/common";
import { filter, map, Observable } from "rxjs";
import { UserDocument } from "../entities/user.schema";
import { SseService } from "../sse.service";
import { ExtractAuthenticatedUser, extractOtherId } from "../util";
import { UserService } from "./user.service";
import MessageEvent from "../message-event";
import { MyUserDto, UserDataDto, UserDto } from "../dtos/user-dtos";
import { FriendshipDto } from "../friendship/friendship.dto";
import { ServerDto } from "../dtos/server.dto";
import { FriendshipMessageDto, GroupMessageDto, MessageDto } from "../dtos/message.dto";
import { GroupDto } from "../group/group.dto";

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
  async getUserData(@ExtractAuthenticatedUser() user: UserDocument): Promise<UserDataDto> {
    const userData = await this.userService.getUserData(user);
    return {
      ...new MyUserDto(userData.user),
      friendships: userData.friendships.map(friendship => {
        const otherId = extractOtherId(user, friendship);
        return new FriendshipDto(otherId, friendship);
      }),
      conversations: userData.conversations.map(conversation => {
        if (conversation.friendshipId !== undefined)
          return new FriendshipMessageDto(conversation)
        else return new GroupMessageDto(conversation);
      }),
      groups: userData.groups.map(group => new GroupDto(group)),
      servers: userData.servers.map(server => new ServerDto(server)),
      users: userData.users.map(user => new UserDto(user))
    }
  }

  @Sse('sse')
  sse(@ExtractAuthenticatedUser() user: UserDocument): Observable<MessageEvent> {
    return this.sseService.sse.pipe(filter(({ userId }) => userId === user.id), map(({ type, data }) => ({ type, data })));
  }

}
