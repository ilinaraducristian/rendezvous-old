import Server from "./server";

type MovedServers = Pick<Server, "id" | "order">[];

export default MovedServers;
