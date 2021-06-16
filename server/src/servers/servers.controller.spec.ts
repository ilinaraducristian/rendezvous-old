import { Test, TestingModule } from "@nestjs/testing";
import { ServersController } from "./servers.controller";
import { AppService } from "../app.service";
import { SocketIOGateway } from "../socketio.gateway";

describe("ServersControllerTest", () => {
  let serversController: ServersController;
  let module: TestingModule;

  beforeAll(async () => {
    const appService = new AppService(null, null);
    module = await Test.createTestingModule({
      controllers: [ServersController],
      providers: [AppService, SocketIOGateway]
    })
      .overrideProvider(AppService)
      .useValue(appService)
      .compile();

    serversController = module.get<ServersController>(ServersController);
    // jest.spyOn(appService, '')
  });

  afterAll(() => {
    module.close();
  });

  it("test1", () => {
    // serversController.createServer()
  });
});
