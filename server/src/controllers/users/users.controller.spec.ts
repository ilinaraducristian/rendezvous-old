import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { AppService } from "../../app.service";
import { ServersController } from "../servers/servers.controller";
import { SocketIOGateway } from "../../socketio.gateway";

describe("UsersController", () => {
  let controller: UsersController;
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

  beforeAll(async () => {

    const appService = new AppService(null, null);

    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [AppService, SocketIOGateway]
    }).overrideProvider(AppService)
      .useValue(appService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterAll(() => {
    module.close();
  });

  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should return users data', async () => {

    const data = await controller.getusersData(user1, [user1.sub, user2.sub]);

    expect(data.users.length).toBeGreaterThan(0);

  })

});
