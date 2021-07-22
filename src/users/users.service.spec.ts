import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UserService', () => {
  beforeAll(() => {
    const module = Test.createTestingModule({
      imports: [UsersService],
    });
  });
});
