import { Injectable } from "@nestjs/common";
import { ServerGroup as Group } from "../../entities/server-group.schema";
import { UserDocument } from "../../entities/user.schema";
import { GroupNotFoundHttpException } from "../../group/exceptions";
import { ServerService } from "../server.service";

@Injectable()
export class ServerGroupService {
  constructor(private readonly serverService: ServerService) {}

  async createGroup(user: UserDocument, id: string, name: string) {
    const server = await this.serverService.getServer(user, id);
    const group = new Group(name);
    server.groups.push(group);
    await server.save();
    return group;
  }

  async getGroup(user: UserDocument, serverId: string, id: string) {
    const server = await this.serverService.getServer(user, serverId);
    const group = server.groups.find((group) => group._id.toString() === id);
    if (group === undefined) throw new GroupNotFoundHttpException();
    return { server, group };
  }
}
