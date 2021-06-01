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

  async createServer(uid: string, name: string): Promise<number> {
    return (await this.serverRepository.save({ name, user_id: uid })).id;
  }

  async createInvitation(sid: number, uid: string): Promise<string> {
    return this.connection.query(`CALL create_invitation(${sid}, ${uid})`);
  }

  async createGroup(sid: number, name: string, uid: string): Promise<number> {
    return this.connection.query(`CALL createGroup(${sid}, ${name}, ${uid})`);
  }

  async createChannel(sid: number, gid: number, type: string, name: string, uid: string): Promise<number> {
    return this.connection.query(`CALL createChannel(${sid}, ${gid}, ${type}, ${name}, ${uid})`);
  }

  async sendMessage(cid: number, text: string, uid: string): Promise<any> {
    return this.connection.query(`CALL send_message(${cid}, ${text}, ${uid})`);
  }

  async getServerData(sid: number, uid: string): Promise<any> {
    return this.connection.query(`CALL get_server_data(${sid}, ${uid})`);
  }

  async getUserServers(uid: string) {
    return this.connection.query(`CALL get_user_servers(${uid})`);
  }

  async getServersData(uid: string): Promise<any> {
    return this.connection.query(
      `SELECT *
       FROM get_server_data
       WHERE owner = ${uid}`
    );
  }

  async joinServer(invitation: string, uid: string): Promise<any> {
    return this.connection.query(`CALL create_invitation(${invitation}, ${uid})`);
  }

}
