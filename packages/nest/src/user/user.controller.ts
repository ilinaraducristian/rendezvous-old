import { Body, Controller, Get, Param, Sse } from "@nestjs/common";
import { filter, from, map, Observable, switchMap } from "rxjs";
import { UserDocument } from "../entities/user.schema";
import { SseService } from "../sse.service";
import { ExtractAuthenticatedUser, extractOtherId } from "../util";
import { UserService } from "./user.service";
import MessageEvent from "../message-event";
import { MyUserDto, UserDataDto, UserDto } from "../dtos/user-dtos";
import { FriendshipDto } from "../friendship/friendship.dto";
import { ServerDto } from "../dtos/server.dto";
import { FriendshipMessageDto, GroupMessageDto } from "../dtos/message.dto";
import { GroupDto } from "../group/group.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService, private readonly sseService: SseService) {}

  @Get(":id")
  async getUser(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string) {
    const retrievedUser = await this.userService.getUser(id);
    return {
      name: retrievedUser.name,
    };
  }

  @Get()
  async getUsers(@ExtractAuthenticatedUser() user: UserDocument, @Body() { users }: { users: string[] }) {
    const retrievedUsers = await this.userService.getUsers(users);
    return retrievedUsers.map((retrievedUser) => ({
      name: retrievedUser.name,
    }));
  }

  @Get("data")
  async getUserData(@ExtractAuthenticatedUser() user: UserDocument): Promise<UserDataDto> {
    const userData = await this.userService.getUserData(user);
    return {
      ...new MyUserDto(userData.user),
      friendships: userData.friendships.map((friendship) => {
        const otherId = extractOtherId(user, friendship);
        return new FriendshipDto(otherId, friendship);
      }),
      conversations: userData.conversations.map((conversation) => {
        if (conversation.friendshipId !== undefined) return new FriendshipMessageDto(conversation);
        else return new GroupMessageDto(conversation);
      }),
      groups: userData.groups.map((group) => new GroupDto(group)),
      servers: userData.servers.map((server) => new ServerDto(server)),
      users: userData.users.map((user) => new UserDto(user)),
    };
  }

  @Sse("sse")
  sse(@ExtractAuthenticatedUser() user: UserDocument): Observable<MessageEvent> {
    return this.sseService.sse$.pipe(
      switchMap((value) => from(this.userService.getUser(user.id).then((user) => ({ value, user })))),
      filter(({ value, user }) => {
        if (value.groupId !== undefined) {
          return user.groups.find((groupId) => value.groupId.toString() === groupId.toString()) !== undefined;
        } else if (value.serverId) {
          return user.servers.find((serverId) => value.serverId.toString() === serverId.toString()) !== undefined;
        }
        return user.id === value.userId.toString();
      }),
      map(({ value: { type, data } }) => ({ type, data }))
    );
  }
}
