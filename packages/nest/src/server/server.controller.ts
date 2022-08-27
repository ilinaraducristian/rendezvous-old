import { Body, Controller, Post } from "@nestjs/common";
import { ServerDto } from "./server.dto";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { ServerService } from "./server.service";

@Controller("servers")
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  async createServer(@ExtractAuthenticatedUser() user: UserDocument, @Body() body: { name: string }): Promise<ServerDto> {
    const server = await this.serverService.createServer(user, body.name);
    return new ServerDto(server);
  }

  @Post("members")
  createMemberSelf(@ExtractAuthenticatedUser() user: UserDocument, @Body() body: { invitation: string }) {
    return this.serverService.createMemberSelf(user, body.invitation);
  }
}
