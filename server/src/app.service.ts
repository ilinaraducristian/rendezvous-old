import { Injectable } from "@nestjs/common";
import { Connection, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ServerEntity } from "./entities/server.entity";
import {
  Channel,
  ChannelType,
  Group,
  Member, Message,
  Server,
  User,
  UserServersData,
  UserServersDataQueryResult
} from "./types";

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

  async sendMessage(userId: string, channelId: number, message: string): Promise<Message> {
    const result = await this.connection.query("CALL send_message(?,?,?)", [userId, channelId, message]);
    return result[0][0]
  }

  async getUserServersData(uid: string): Promise<UserServersData> {
    const result = await this.connection.query("CALL get_user_servers_data(?)", [uid]);
    return this.processQuery(result);
  }

  async joinServer(uid: string, invitation: string): Promise<UserServersData> {
    const result = await this.connection.query("CALL join_server(?,?)", [uid, invitation]);
    return this.processQuery(result);
  }

  processQuery(result: UserServersDataQueryResult): UserServersData {
    const serversTable = result[0].map<[number, Server]>((server: Server) => [server.id, {
      id: server.id,
      name: server.name,
      userId: server.userId,
      invitation: server.invitation,
      invitationExp: server.invitationExp
    }]);
    const groupsTable = result[1].map<[number, Group] >((group: Group) => [group.id, {
      id: group.id,
      serverId: group.serverId,
      name: group.name
    }]);
    const channelsTable = result[2].map<[number, Channel] >((channel: Channel) => [channel.id, {
      id: channel.id,
      serverId: channel.serverId,
      groupId: channel.groupId,
      type: channel.type,
      name: channel.name
    }]);

    const membersTable: [number, Member][] = [];
    const usersTable: [string, User][] = [];

    result[3].forEach((member: Member & User) => {
      membersTable.push([member.id, {
        id: member.id,
        userId: member.userId,
        serverId: member.serverId
      }]);
      usersTable.push([member.userId, {
        id: member.userId,
        username: member.username,
        firstName: member.firstName,
        lastName: member.lastName
      }]);
    });

    return {
      servers: serversTable,
      channels: channelsTable,
      groups: groupsTable,
      members: membersTable,
      users: usersTable
    };

  }

}

