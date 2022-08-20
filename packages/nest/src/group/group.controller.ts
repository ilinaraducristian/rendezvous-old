import { Body, Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { GroupDto } from "../entities/user-data.dto";
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

  @Post(":id/members")
  createGroupMember(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Body() body: { id: string }): Promise<void> {
    return this.groupService.createGroupMember(user, id, body.id);
  }

  @Post(":id/messages")
  async createGroupMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Body() body: { text: string }) {
    const group = await this.groupService.createGroupMessage(user, id, body.text);
    return {
      id: group.id
    };
  }

}
