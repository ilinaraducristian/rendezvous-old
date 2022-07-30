import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(AppModule.MODULE_METADATA).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', async () => {
    console.log(await service.createFriendship('62e4fd9586beffe81bdd8ba6', '62e4fda7bf9a0f7a4e276011'));
    expect(service).toBeDefined();
  });
});
