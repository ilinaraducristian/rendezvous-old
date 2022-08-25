import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { UserDocument } from "../entities/user.schema";
import { ObjectIdPipe } from "../object-id.pipe";
import { ExtractAuthenticatedUser } from "../util";
import { GroupDto, JoinGroupDto, NewGroupDto } from "./group.dto";
import { GroupService } from "./group.service";

@Controller("groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @Post()
  async createGroup(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Body() { name }: NewGroupDto
  ): Promise<GroupDto> {
    const group = await this.groupService.createGroup(user, name);
    return new GroupDto(group);
  }

  @Get()
  async getGroups(
    @ExtractAuthenticatedUser() user: UserDocument
  ): Promise<GroupDto[]> {
    const groups = await this.groupService.getGroups(user);
    return groups.map(group => new GroupDto(group));
  }

  @Delete(":id")
  @HttpCode(204)
  async deleteGroup(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("id", new ObjectIdPipe()) id: string
  ): Promise<void> {
    await this.groupService.deleteGroup(user, id);
  }

  @Post('members')
  async createMemberSelf(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Body() { invitation }: JoinGroupDto
  ): Promise<GroupDto> {
    const group = await this.groupService.createMemberSelf(user, invitation);
    return new GroupDto(group);
  }

}
