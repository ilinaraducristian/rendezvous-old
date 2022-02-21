import { UserDto } from "../entities/user";
import Friendship from "./friendship";
import ServerDto from "./server";

type GetDataResponse = {
  friendships: Friendship[];
  servers: ServerDto[];
  users: UserDto[];
};

export default GetDataResponse;
