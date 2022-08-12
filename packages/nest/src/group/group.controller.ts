import { Body, Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { GroupService } from "./group.service";

@Controller("groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @Post()
  async createGroup(@ExtractAuthenticatedUser() user: UserDocument, @Body() { name }: { name: string }) {
    const newGroup = await this.groupService.createGroup(user, name);
    return {
      id: newGroup.id
    }
  }

  @Get()
  async getGroups(@ExtractAuthenticatedUser() user: UserDocument) {
    return (await this.groupService.getGroups(user)).map(group => ({
      id: group.id,
      name: group.name,
      members: group.members
    }));
  }

  @Delete(":id")
  @HttpCode(204)
  async deleteGroup(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string) {
    await this.groupService.deleteGroup(user, id);
  }

  @Post(":id/members")
  createGroupMember(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Body() body: { id: string }) {
    return this.groupService.createGroupMember(user, id, body.id);
  }

}
