import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { ServerService } from "./server.service";

@Controller("servers")
export class ServerController {
  constructor(private readonly serverService: ServerService) { }

  @Post()
  async createServer(@ExtractAuthenticatedUser() user: UserDocument, @Body() body: { name: string }) {
    const server = await this.serverService.createServer(user, body.name);
    return server;
  }

  @Post('members')
  createMemberSelf(@ExtractAuthenticatedUser() user: UserDocument, @Body() body: { invitation: string }) {
    return this.serverService.createMemberSelf(user, body.invitation);
  }

  @Post(':id/groups')
  createGroup(@ExtractAuthenticatedUser() user: UserDocument, @Param('id') id: string, @Body() body: { name: string }) {
    return this.serverService.createGroup(user, id, body.name);
  }

  @Post(':id/groups/:groupId/channels')
  createChannel(@ExtractAuthenticatedUser() user: UserDocument, @Param('id') id: string, @Param('groupId') groupId: string, @Body() body: { name: string }) {
    return this.serverService.createChannel(user, id, groupId, body.name);
  }

  @Post(':id/groups/:groupId/channels/:channelId/messages')
  createChannelMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param('id') id: string, @Param('groupId') groupId: string, @Param('channelId') channelId: string, @Body() body: { text: string }) {
    return this.serverService.createChannelMessage(user, id, groupId, channelId, body.text);
  }

  @Get(':id/groups/:groupId/channels/:channelId/messages')
  getChannelMessages(@ExtractAuthenticatedUser() user: UserDocument, @Param('id') id: string, @Param('groupId') groupId: string, @Param('channelId') channelId: string, @Query("offset") offset: number = 0, @Query("limit") limit: number = 100) {
    return this.serverService.getChannelMessages(user, id, groupId, channelId, offset, limit);
  }

}
