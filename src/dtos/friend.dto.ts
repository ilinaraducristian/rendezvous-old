import {Message} from './message.dto';

export type Friendship = {
  id: number,
  user1Id: string,
  user2Id: string,
  messages: Message[]
}

export type FriendRequest = {
  id: number,
  userId: string,
  incoming: boolean
}