import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Server } from "./entities/server.entity";

describe("AppService", () => {
  let appService: AppService;
  const uid1 = "509652db-483c-4328-85b1-120573723b3a";
  const uid2 = "8161216d-c1c8-4d01-b21a-ba1f559d29e9";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        TypeOrmModule.forFeature([Server])
      ],
      providers: [AppService]
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it("should create a new server", async () => {
    expect(await appService.createServer(uid1, "a new server")).not.toThrow();
  });

  it.only("should return a new invitation as uuid", async () => {
    const newServer = await appService.createServer(uid1, "a new server");
    const invitation = await appService.createInvitation(uid1, newServer.server_id);
    expect(invitation).toBeTruthy();
  });

  it("should return the joined server details", async () => {
    const newServer = await appService.createServer(uid1, "a new server");
    const invitation = await appService.createInvitation(uid1, newServer.server_id);
    const serverDetails = await appService.joinServer(uid2, invitation);
    expect(invitation).toBeTruthy();
  });

});