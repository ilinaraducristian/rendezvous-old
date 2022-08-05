import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule(AppModule.MODULE_METADATA).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => module.close());

});
