import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { ServerService } from "./server.service";

@Controller("servers")
export class ServerController {
  constructor(private readonly serverService: ServerService) { }

  @Post()
  async createServer(@ExtractAuthenticatedUser() user: UserDocument, @Body() body: { name: string }) {
    const server = await this.serverService.createServer(user, body.name);
    return {
      id: server.id
    }
  }

  @Post(':id/groups')
  createGroup(@ExtractAuthenticatedUser() user: UserDocument, @Param('id') id: string, @Body() body: { name: string }) {
    return this.serverService.createGroup(user, id, body.name);
  }

}
