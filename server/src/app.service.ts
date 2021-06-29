import { Injectable } from "@nestjs/common";
import { Connection, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ServerEntity } from "./entities/server.entity";
import ChannelType from "./models/ChannelType";
import { UserServersData } from "./types";

@Injectable()
export class AppService {

  constructor(
    private connection: Connection,
    @InjectRepository(ServerEntity) private serverRepository: Repository<ServerEntity>
  ) {
  }

  async createServer(uid: string, name: string): Promise<UserServersData> {
    const result = await this.connection.query("CALL create_server(?,?)", [uid, name]);
    return this.processQuery(result);
  }

  async createInvitation(userId: string, serverId: number): Promise<string> {
    return this.connection.query("SELECT create_invitation(?,?)", [userId, serverId]).then(result => Object.entries(result[0])[0][1] as string);
  }

  async createGroup(uid: string, sid: number, name: string): Promise<number> {
    return this.connection.query("SELECT create_group(?,?,?)", [uid, sid, name]).then(result => Object.entries(result[0])[0][1] as number);
  }

  async createChannel(userId: string, serverId: number, groupId: number | null, type: ChannelType, name: string): Promise<number> {
    return this.connection.query("SELECT create_channel(?,?,?,?,?)", [userId, serverId, groupId, type, name]).then(result => Object.entries(result[0])[0][1] as number);
  }

  async sendMessage(uid: string, sid: number, cid: number, text: string): Promise<number> {
    return this.connection.query("SELECT send_message(?,?,?,?)", [uid, sid, cid, text]).then(result => Object.entries(result[0])[0][1] as number);
  }

  async getUsersData(serverIds: number[]) {
    const results = await Promise.all(serverIds.map(serverId => this.connection.query("CALL get_users_data(?)", [serverId])));
  }

  async getUserServersData(uid: string): Promise<UserServersData> {
    const result = await this.connection.query("CALL get_user_servers_data(?)", [uid]);
    return this.processQuery(result);
  }

  async joinServer(uid: string, invitation: string): Promise<UserServersData> {
    const result = await this.connection.query("CALL join_server(?,?)", [uid, invitation]);
    return this.processQuery(result);
  }

  processQuery(result: any): UserServersData {
    const serversTable = result[0].map(server => [server.id, {
      id: server.id,
      name: server.name,
      userId: server.userId,
      invitation: server.invitation,
      invitationExp: server.invitationExp,
      order: server.order
    }]);
    const groupsTable = result[1].map(group => [group.id, {
      id: group.id,
      serverId: group.serverId,
      name: group.name,
      order: group.order
    }]);
    const channelsTable = result[2].map(channel => [channel.id, {
      id: channel.id,
      serverId: channel.serverId,
      groupId: channel.groupId,
      type: channel.type,
      name: channel.name,
      order: channel.order
    }]);
    const membersTable = result[3].map(member => [member.id, {
      id: member.id,
      userId: member.userId,
      serverId: member.serverId
    }]);
    const usersTable = result[3].map(user => [user.userId, {
      id: user.userId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    }]);
    return {
      servers: serversTable,
      channels: channelsTable,
      groups: groupsTable,
      members: membersTable,
      users: usersTable
    };
  }

  async getServersData(uid: string): Promise<any[]> {
    return this.connection.query("CALL get_user_servers_data(?)", [uid]).then(result => result[0]);
  }


}

