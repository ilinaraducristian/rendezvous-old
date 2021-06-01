import { Test, TestingModule } from "@nestjs/testing";
import { ServersController } from "./servers.controller";
import { AppService } from "../app.service";

describe("ServersController", () => {
  let serversController: ServersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServersController],
      providers: [AppService]
    }).compile();

    serversController = app.get<ServersController>(ServersController);
  });

  describe("root", () => {
  });
});
