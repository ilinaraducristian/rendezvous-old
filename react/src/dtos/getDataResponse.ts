import Friendship from "./friendship";
import ServerDto from "./server";

type GetDataResponse = {
  friendships: Friendship[];
  servers: ServerDto[];
};

export default GetDataResponse;
