import { Injectable } from "@nestjs/common";
import { Connection, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ServerEntity } from "./entities/server.entity";
import {
  Channel,
  ChannelType,
  Group,
  Member,
  Message,
  Server,
  User,
  UserServersData,
  UserServersDataQueryResult
} from "./types";
import fetch from "node-fetch";

@Injectable()
export class AppService {

  constructor(
    private connection: Connection,
    @InjectRepository(ServerEntity) private serverRepository: Repository<ServerEntity>
  ) {
  }

  private static processQuery(result: UserServersDataQueryResult): UserServersData {
    const serversTable = result[0].map<[number, Server]>((server: Server) => [server.id, server]);
    const groupsTable = result[1].map<[number, Group]>((group: Group) => [group.id, group]);
    const channelsTable = result[2].map<[number, Channel]>((channel: Channel) => [channel.id, channel]);
    const membersTable = result[3].map<[number, Member]>((member: Member) => [member.id, member]);
    const usersTable = result[4].map<[string, User]>((user: User) => [user.id, user]);

    return {
      servers: serversTable,
      channels: channelsTable,
      groups: groupsTable,
      members: membersTable,
      users: usersTable
    };

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
    return result[0][0];
  }

  async createServer(uid: string, name: string): Promise<UserServersData> {
    let result = await this.connection.query("CALL create_server(?,?)", [uid, name]);
    result = this.appendUsersDataFromAuthService(result);
    return AppService.processQuery(result);
  }

  async getUserServersData(userId: string): Promise<UserServersData> {
    // get data from database
    let result: UserServersDataQueryResult = await this.connection.query("CALL get_user_servers_data(?)", [userId]);
    result = await this.appendUsersDataFromAuthService(result);
    return AppService.processQuery(result);
  }

  async getMessages(userId: string, channelId: number, offset: number): Promise<[number, Message][]> {
    const result = await this.connection.query("CALL get_messages(?,?,?)", [userId, channelId, offset]);
    return result[0].map(result => [result.id, result]);
  }

  async joinServer(uid: string, invitation: string): Promise<UserServersData> {
    let result: UserServersDataQueryResult = await this.connection.query("CALL join_server(?,?)", [uid, invitation]);
    result = await this.appendUsersDataFromAuthService(result);
    return AppService.processQuery(result);
  }

  private async appendUsersDataFromAuthService(result: UserServersDataQueryResult) {
    // get users information from the auth service
    result[4] = [];
    for (const member of result[3]) {
      const response: any = await fetch(`${process.env.AUTH0_ISSUER_URL}oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: process.env.AUTH0_AUDIENCE,
          grant_type: "client_credentials"
        })
      })
        .then(response => response.json())
        .then(response => fetch(`${process.env.AUTH0_AUDIENCE}users?fields=user_id%2Cnickname%2Cgiven_name%2Cfamily_name&include_fields=true`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${response.access_token}`
          }
        }))
        .then(response => response.json())
        .then(response => response.map(response => {
          response.username = response.nickname;
          delete response.nickname;
          return response;
        }));
      result[4].push({
        id: response.userId,
        username: response.username,
        firstName: response.given_name,
        lastName: response.family_name
      });
    }
    return result;
  }

}

