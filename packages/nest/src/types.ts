export type ConversationHolder = { id: string; name: string; lastMessage?: string };

export type UserData = {
  friends: ConversationHolder[];
  groups: ConversationHolder[];
  servers: {
    id: string;
    name: string;
    members: { id: string; name: string }[];
    groups: { id: string; name?: string; channels: { id: string; name: string }[] }[];
  }[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type PublicUser = Pick<User, "id" | "name">;

export type Group = {
  id: string;
  members: PublicUser[];
};

export type Channel = {
  id: string;
  name: string;
};

export type ServerGroup = {
  id: string;
  name: string;
  channels: Channel[];
};

export type Server = {
  id: string;
  name: string;
  groups: ServerGroup[];
  members: PublicUser[];
};
