import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { VerificationService } from 'src/verification/verification.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockVerificationService = {
  create: jest.fn(),
  findOne: jest.fn(),
  verifyEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerifyEmail: jest.fn(),
};

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: VerificationService,
          useValue: mockVerificationService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    service = await module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('should fail if user exists', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'Mock',
      });
      const result = await service.createAccount({
        email: '',
        password: '1234',
        role: 0,
      });

      expect(result).toMatchObject({
        ok: false,
        error: 'The current email exists.',
      });
    });
  });

  it.todo('login');
  it.todo('getById');
  it.todo('editUser');
  it.todo('getAll');
});
