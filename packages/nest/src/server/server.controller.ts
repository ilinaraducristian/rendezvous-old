import { Body, Controller, Post } from "@nestjs/common";
import { ServerDto } from "../dtos/server.dto";
import { UserDocument } from "../entities/user.schema";
import { SseService } from "../sse.service";
import { ExtractAuthenticatedUser } from "../util";
import { ServerService } from "./server.service";

@Controller("servers")
export class ServerController {
  constructor(private readonly serverService: ServerService, private readonly sseService: SseService) {}

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
