import { Body, Controller, Param, Post } from "@nestjs/common";
import { Types } from "mongoose";
import { GroupDto, ServerParams } from "../server.dto";
import { UserDocument } from "../../entities/user.schema";
import { SseService } from "../../sse.service";
import { ExtractAuthenticatedUser } from "../../util";
import { ServerGroupService } from "./server-group.service";

@Controller("servers/:serverId/groups")
export class ServerGroupController {
  constructor(private readonly serverGroupService: ServerGroupService, private readonly sseService: SseService) {}

  @Post()
  async createGroup(@ExtractAuthenticatedUser() user: UserDocument, @Param() { serverId }: ServerParams, @Body() body: { name: string }) {
    const group = await this.serverGroupService.createGroup(user, serverId, body.name);
    this.sseService.group(new Types.ObjectId(serverId), new GroupDto(group, serverId));
  }
}
