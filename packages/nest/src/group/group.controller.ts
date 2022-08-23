import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { ConversationDto, GroupDto } from "../entities/dtos";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { GroupService } from "./group.service";

@Controller("groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @Post()
  createGroup(@ExtractAuthenticatedUser() user: UserDocument, @Body() { name }: { name: string }): Promise<GroupDto> {
    return this.groupService.createGroup(user, name);
  }

  @Get()
  getGroups(@ExtractAuthenticatedUser() user: UserDocument): Promise<GroupDto[]> {
    return this.groupService.getGroups(user);
  }

  @Delete(":id")
  @HttpCode(204)
  async deleteGroup(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string): Promise<void> {
    await this.groupService.deleteGroup(user, id);
  }

  @Post('members')
  createMemberSelf(@ExtractAuthenticatedUser() user: UserDocument, @Body() body: { invitation: string }) {
    return this.groupService.createMemberSelf(user, body.invitation);
  }

  @Post(":id/messages")
  createGroupMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Body() body: { text: string }): Promise<ConversationDto> {
    return this.groupService.createGroupMessage(user, id, body.text);
  }

  @Get(':id/messages')
  getFriendshipMessages(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Query("offset") offset: number = 0, @Query("limit") limit: number = 100): Promise<ConversationDto[]> {
    return this.groupService.getGroupMessages(user, id, offset, limit);
  }

}
