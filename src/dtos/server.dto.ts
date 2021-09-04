import {servers} from "../types/Server";

export type NewServerRequest = {
  name: string,
}

export type NewServerResponse = servers

export type NewInvitationRequest = {
  serverId: number,
}

export type JoinServerRequest = {
  invitation: string
}

export type JoinServerResponse = servers
