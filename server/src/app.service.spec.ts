import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServerEntity } from "./entities/server.entity";
import fetch from "node-fetch";

describe("AppServiceTest", () => {
  let appService: AppService;
  let module: TestingModule;
  const uid1 = "40ede82c-41a3-44b9-97d7-25dc25bde568";
  const uid2 = "588ed943-d335-4b2c-89fc-98e1745e8859";

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "mysql",
          host: "localhost",
          port: 3306,
          username: "root",
          password: "root",
          database: "capp",
          entities: [
            __dirname + "/entities/**/*.{ts,js}"
          ],
          "synchronize": false
        }),
        TypeOrmModule.forFeature([ServerEntity])
      ],
      providers: [AppService]
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  afterAll(() => {
    module.close();
  });

  describe("basic functionality", () => {
    it("should create a new server", async () => {
      let response: any = await fetch(`${process.env.AUTH0_ISSUER_URL}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: process.env.AUTH0_AUDIENCE,
          grant_type: "client_credentials"
        })
      });

      console.log(response);

      response = await fetch(`${process.env.AUTH0_AUDIENCE}users?fields=user_id%2Cnickname%2Cgiven_name%2Cfamily_name&include_fields=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${response.access_token}`
        }
      });

      console.log(response);
    });
  });

  // describe("in depth testing", function() {
  //
  //   it("should create a new group", async () => {
  //     let server: any = await appService.createServer(uid1, "a new server", 0);
  //     const groupId = await appService.createGroup(uid1, server.id, "a new group");
  //     server = (await appService.getUserServersData(uid1)).get(server.id);
  //     expect(server.groups.get(groupId)).toBeDefined();
  //   });
  //
  //   it("should create a new channel without belonging to a group", async () => {
  //     let server: any = await appService.createServer(uid1, "a new server", 0);
  //     const channelId = await appService.createChannel(uid1, server.id, null, ChannelType.Text, "a new channel");
  //     server = (await appService.getUserServersData(uid1)).get(server.id);
  //     expect(server.channels.get(channelId)).toBeDefined();
  //   });
  //
  //   it("should create a new channel belonging to a group", async () => {
  //     let server: any = await appService.createServer(uid1, "a new server", 0);
  //     const groupId = await appService.createGroup(uid1, server.id, "a new group");
  //     const channelId = await appService.createChannel(uid1, server.id, groupId, ChannelType.Text, "a new channel");
  //     server = (await appService.getUserServersData(uid1)).get(server.id);
  //     expect(server.channels.get(channelId)).toBeDefined();
  //     expect(server.channels.get(channelId).group_id).toBe(groupId);
  //   });
  //
  //   it("should return the user servers info", async () => {
  //     const server = await appService.createServer(uid1, "a new server", 0)
  //       .then(() => appService.getUserServersData(uid1));
  //     expect(server).toBeDefined();
  //   });
  //
  //   it("should return a new invitation as uuid", async () => {
  //     const newServer = await appService.createServer(uid1, "a new server", 0);
  //     const invitation = await appService.createInvitation(uid1, newServer.id);
  //     expect(invitation).toMatch(UUIDRegex);
  //   });
  //
  //   it("should add new user to server", async () => {
  //     const newServer = await appService.createServer(uid1, "a new server", 0);
  //     const invitation = await appService.createInvitation(uid1, newServer.id);
  //     await appService.joinServer(uid2, invitation);
  //     const servers = await appService.getUserServersData(uid2);
  //     expect(servers.get(newServer.id)).toBeDefined();
  //     let found = false;
  //     servers.get(newServer.id).members.forEach(member => {
  //       if (!found && member.user_id == uid2) {
  //         found = true;
  //       }
  //     });
  //     expect(found).toBeTruthy();
  //   });
  //
  //   it("should send a message", async () => {
  //     const newServer = await appService.createServer(uid1, "a new server", 0);
  //     const messageId = await appService.sendMessage(uid1, newServer.id, newServer.channel1_id, "a new message");
  //     expect(typeof messageId).toBe("number");
  //   });
  //
  // });

});