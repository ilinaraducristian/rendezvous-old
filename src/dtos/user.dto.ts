import {Server} from './server.dto';
import {FriendRequest, Friendship} from './friend.dto';

export type User = {
  id: string,
  username: string,
  firstName: string,
  lastName: string
}

export type KeycloakUser = {
  sub: string,
  preferred_username: string,
  email: string, name: string,
  nickname: string,
  given_name: string,
  family_name: string
}

export type UserDataResponse = UserServersData;

export type AcceptFriendRequest = {
  friendRequestId: number
}

export type SendFriendRequest = {
  username: string
}

export type SendFriendRequestResponse = {
  id: number,
  userId: string
}

export type UserServersData = {
  servers: Server[],
  users: User[]
}

export type UserData = {
  servers: Server[],
  friendships: Friendship[],
  friendRequests: FriendRequest[],
  users: User[]
}
