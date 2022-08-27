import { Body, Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { GroupDto, GroupParams, JoinGroupDto, NewGroupDto } from "./group.dto";
import { GroupService } from "./group.service";

@Controller("groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createGroup(@ExtractAuthenticatedUser() user: UserDocument, @Body() { name }: NewGroupDto): Promise<GroupDto> {
    const group = await this.groupService.createGroup(user, name);
    return new GroupDto(group);
  }

  @Get()
  async getGroups(@ExtractAuthenticatedUser() user: UserDocument): Promise<GroupDto[]> {
    const groups = await this.groupService.getGroups(user);
    return groups.map((group) => new GroupDto(group));
  }

  @Delete()
  @HttpCode(204)
  async deleteGroup(@ExtractAuthenticatedUser() user: UserDocument, @Param() { groupId }: GroupParams): Promise<void> {
    await this.groupService.deleteGroup(user, groupId);
  }

  @Post("members")
  async createMemberSelf(@ExtractAuthenticatedUser() user: UserDocument, @Body() { invitation }: JoinGroupDto): Promise<GroupDto> {
    const group = await this.groupService.createMemberSelf(user, invitation);
    return new GroupDto(group);
  }
}
