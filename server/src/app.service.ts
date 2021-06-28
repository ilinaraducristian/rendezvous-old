import { Injectable } from "@nestjs/common";
import { Connection, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ServerEntity } from "./entities/server.entity";
import Server from "./models/Server";
import ChannelType from "./models/ChannelType";
import { NewServer, UserServersData } from "./types";

@Injectable()
export class AppService {

  constructor(
    private connection: Connection,
    @InjectRepository(ServerEntity) private serverRepository: Repository<ServerEntity>
  ) {
  }

  async createServer(uid: string, name: string, order: number): Promise<NewServer> {
    let result = await this.connection.query("CALL create_server(?,?,?)", [uid, name, order]);
    result = result[0][0];
    Object.entries(result).forEach((entry: [string, string]) => {
      const entryAsNumber = parseInt(entry[1]);
      if (isNaN(entryAsNumber)) throw new Error("id is NaN, database error");
      result[entry[0]] = entryAsNumber;
    });
    result.id = result.server_id;
    delete result.server_id;
    return result;
  }

  async createInvitation(uid: string, sid: number): Promise<string> {
    return this.connection.query("SELECT create_invitation(?,?)", [uid, sid]).then(result => Object.entries(result[0])[0][1] as string);
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
    console.log(results);
  }

  async getUserServersData(uid: string): Promise<UserServersData> {
    const query1Result = await this.connection.query("CALL get_user_servers_data(?)", [uid]);
    const serversTable = query1Result[0].map(server => [server.id, {
      id: server.id,
      name: server.name,
      userId: server.owner,
      invitation: server.invitation,
      invitationExp: server.invitation_exp,
      order: server.order
    }]);
    const groupsTable = query1Result[1].map(group => [group.id, {
      id: group.id,
      serverId: group.server_id,
      name: group.name,
      order: group.order
    }]);
    const channelsTable = query1Result[2].map(channel => [channel.id, {
      id: channel.id,
      serverId: channel.server_id,
      groupId: channel.group_id,
      type: channel.type,
      name: channel.name,
      order: channel.order
    }]);
    const membersTable = query1Result[3].map(member => [member.id, {
      id: member.id,
      userId: member.user_id,
      serverId: member.server_id
    }]);
    const usersTable = query1Result[3].map(member => [member.user_id, {
      id: member.user_id,
      username: member.username,
      firstName: member.first_name,
      lastName: member.last_name
    }]);

    // if (membersTable.length > 0) {
    //   const membersUserIds = membersTable.map(member => `'${member.user_id}'`).join();
    //   query2Result = await this.connection.query(`SELECT *
    //                                               FROM get_users
    //                                               WHERE id IN (${membersUserIds})`);
    // }
    return {
      servers: serversTable,
      channels: channelsTable,
      groups: groupsTable,
      members: membersTable,
      users: usersTable
    };
  }

  // async getUserServersData(uid: string): Promise<Map<number, Server>> {
  //   return this.connection.query("CALL get_user_servers_data(?)", [uid])
  //     .then(result => {
  //       const servers = new Map<number, Server>();
  //       result[0].forEach((server: any) => {
  //         servers.set(server.id, {
  //           id: server.id,
  //           name: server.name,
  //           owner: server.owner,
  //           invitation: server.invitation,
  //           invitation_exp: new Date(server.invitation_exp),
  //           groups: new Map<number, Group>(),
  //           channels: new Map<number, Channel>(),
  //           members: new Map<number, Member>()
  //         });
  //       });
  //       result[1].forEach((group: any) => {
  //         const server = servers.get(group.server_id);
  //         server.groups.set(group.id, group as Group);
  //       });
  //       result[2].forEach((channel: any) => {
  //         const server = servers.get(channel.server_id);
  //         server.channels.set(channel.id, channel as Channel);
  //       });
  //       result[3].forEach((member: any) => {
  //         const server = servers.get(member.server_id);
  //         server.members.set(member.id, member as Member);
  //       });
  //       return servers;
  //     });
  // }

  async getServersData(uid: string): Promise<any[]> {
    return this.connection.query("CALL get_user_servers_data(?)", [uid]).then(result => result[0]);
  }

  async joinServer(uid: string, invitation: string): Promise<Server> {
    return this.connection.query("CALL join_server(?,?)", [uid, invitation]);
  }

}

