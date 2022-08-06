import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { ServerService } from "./server.service";

@Controller("servers")
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  createServer(@Body() newServer: { name: string }) {
    return this.serverService.createServer(newServer.name);
  }

  @Delete(":id")
  deleteServer(@Param('id') id: string) {
    return this.serverService.deleteServer(id);
  }

  @Post(':serverId/groups')
  createGroup(@Param('serverId') serverId: string, @Body() newGroup: { name: string }) {
    return this.serverService.createGroup(serverId, newGroup.name);
  }

  @Delete(':serverId/groups/:id')
  deleteGroup(@Param('serverId') serverId: string, @Param('id') id: string) {
    return this.serverService.deleteGroup(serverId, id);
  }

  @Post(':serverId/groups/:groupId/channels')
  createChannel(@Param('serverId') serverId: string, @Param('groupId') groupId: string, @Body() newChannel: { name: string }) {
    return this.serverService.createChannel(serverId, groupId, newChannel.name);
  }

  @Delete(':serverId/groups/:groupId/channels/:id')
  deleteChannel(@Param('serverId') serverId: string, @Param('groupId') groupId: string, @Param('id') id: string) {
    return this.serverService.deleteChannel(serverId, groupId, id);
  }

}
