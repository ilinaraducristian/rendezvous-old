import { Injectable } from "@nestjs/common";
import { Connection, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Server } from "./entities/server.entity";

@Injectable()
export class AppService {

  constructor(
    private connection: Connection,
    @InjectRepository(Server) private serverRepository: Repository<Server>
  ) {
  }

  async createServer(uid: string, name: string): Promise<{
    server_id: number,
    group1_id: number,
    group2_id: number,
    channel1_id: number,
    channel2_id: number,
    member_id: number,
  }> {
    return this.connection.query("CALL create_server(?,?)", [uid, name]).then(oldResult => {
      const result = oldResult[0][0];
      Object.entries(result).forEach((entry: [string, string]) => {
        const entryAsNumber = parseInt(entry[1]);
        if (isNaN(entryAsNumber)) throw new Error("id is NaN, database error");
        result[entry[0]] = entryAsNumber;
      });
      return result;
    });
  }

  async createInvitation(uid: string, sid: number): Promise<string> {
    return this.connection.query("SELECT create_invitation(?,?)", [uid, sid]).then(result => Object.entries(result[0])[0][1] as string);
  }

  async createGroup(uid: string, sid: number, name: string): Promise<number> {
    return this.connection.query("CALL create_group(?,?,?)", [uid, sid, name]);
  }

  async createChannel(uid: string, sid: number, gid: number, type: string, name: string): Promise<number> {
    return this.connection.query("CALL create_channel(?,?,?,?,?)", [uid, sid, gid, type, name]);
  }

  async sendMessage(uid: string, cid: number, text: string): Promise<any> {
    return this.connection.query("CALL send_message(?,?,?)", [uid, cid, text]);
  }

  async getServerData(uid: string, sid: number): Promise<any> {
    return this.connection.query("CALL get_server_data(?,?)", [uid, sid]);
  }

  async getUserServers(uid: string) {
    return this.connection.query("CALL get_user_servers(?)", [uid]).then(result => result[0]);
  }

  async getServersData(uid: string): Promise<any[]> {
    return this.connection.query("CALL get_user_servers_data(?)", [uid]).then(result => result[0]);
  }

  async joinServer(uid: string, invitation: string): Promise<any> {
    return this.connection.query("CALL join_server(?,?)", [uid, invitation]);
  }

}
