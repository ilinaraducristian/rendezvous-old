import { Test, TestingModule } from "@nestjs/testing";
import { ServersController } from "./servers.controller";
import { AppService } from "../../app.service";
import { SocketIOGateway } from "../../socketio.gateway";
import SortedMap from "../../util/SortedMap";
import { Channel, Group, Member, Server, User } from "../../types";
import mock = jest.mock;

describe("ServersControllerTest", () => {

  const appService = new AppService(null, null);

  const mockDb = {
    servers: new SortedMap<Server>(),
    channels: new SortedMap<Channel>(),
    groups: new SortedMap<Group>(),
    members: new SortedMap<Member>(),
    users: new Map<User>()
  };

  jest.spyOn(appService, "createServer")
    .mockImplementation(async (uid: string, name: string, order: number) => {
      const lastServer = mockDb.servers.last();
      const lastChannel = mockDb.channels.last();
      const lastGroup = mockDb.groups.last();
      const lastMember = mockDb.members.last();
      if(lastServer === undefined)
        mockDb.servers.set(1, {id:1, name, order, user_id: uid, invitation: null, invitation_exp: null})
      if(lastGroup)
      if (lastChannel === undefined)
        mockDb.channels.set(1, {id: 1, name: 'general', group_id})
    return {
      id: lastServer === undefined ? 1 : lastServer.id,
      group1_id: lastGroup === undefined ? 1 : lastGroup.id,
      group2_id: lastGroup === undefined ? 2 : lastGroup.id,
      channel1_id: lastServer === undefined ? 1 : lastServer.id,
      channel2_id: lastServer === undefined ? 1 : lastServer.id,
      member_id: lastServer === undefined ? 1 : lastServer.id,
    }
  })

  let controller: ServersController;
  let module: TestingModule;

  const user1 = {
    sub: "",
    preferred_username: "user1",
    email: "user1@email.com", name: "user",
    nickname: "user1",
    given_name: "user",
    family_name: "name"
  };

  const user2 = {
    sub: "",
    preferred_username: "user1",
    email: "user1@email.com", name: "user",
    nickname: "user1",
    given_name: "user",
    family_name: "name"
  };

  const invitation = ''

  beforeAll(async () => {

    module = await Test.createTestingModule({
      controllers: [ServersController],
      providers: [AppService, SocketIOGateway]
    })
      .overrideProvider(AppService)
      .useValue(appService)
      .compile();

    controller = module.get<ServersController>(ServersController);
  });

  afterAll(() => {
    module.close();
  });

  it("should return the new server ids", async () => {
    const newServer = await controller.createServer(user1, "a new server", 0);
    expect(newServer.id).toBeDefined();
    expect(newServer.channel1_id).toBeDefined();
    expect(newServer.channel2_id).toBeDefined();
    expect(newServer.group1_id).toBeDefined();
    expect(newServer.group2_id).toBeDefined();
    expect(newServer.member_id).toBeDefined();
  });

  it("should return user servers data", async () => {

    const data = await controller.getUserServersData(user1);

    expect(data.servers.length).toBeGreaterThan(0);
    expect(data.channels.length).toBeGreaterThan(0);
    expect(data.groups.length).toBeGreaterThan(0);
    expect(data.members.length).toBeGreaterThan(0);

  });

  it('should return an invitation', async () => {
    const invitation = await controller.createInvitation(user1, 1);
    expect(invitation).toBeDefined();
  })

  it('should return the joined server data', async () => {
    const server = await controller.joinServer(user1, invitation);
    expect(server.channels.length).toBeGreaterThan(0);
    expect(server.groups.length).toBeGreaterThan(0);
    expect(server.members.length).toBeGreaterThan(0);
  })

});
