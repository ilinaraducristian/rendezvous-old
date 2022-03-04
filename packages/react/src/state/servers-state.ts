import { makeAutoObservable } from "mobx";
import Server from "../entities/server";
import OrderedMap from "../ordered-map";

export class ServersState {
  _servers: OrderedMap<string, Server> = new OrderedMap();

  constructor() {
    makeAutoObservable(this);
  }

  set servers(servers: OrderedMap<string, Server>) {
    this._servers = servers;
  }

  get servers() {
    return this._servers;
  }

  addServer(id: string, server: Server) {
    this.servers.set(id, server);
  }

  removeServer(id: string) {
    this.servers.delete(id);
  }
}

export default new ServersState();
