import ServerDto from "./server";

type MovedServers = Pick<ServerDto, "id" | "order">[];

export default MovedServers;
