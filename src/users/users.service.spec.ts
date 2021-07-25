import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { VerificationService } from 'src/verification/verification.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

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
type verificationServiceMock = Partial<
  Record<keyof VerificationService, jest.Mock>
>;

describe('UserService', () => {
  let service: UsersService;
  let verificationService: verificationServiceMock;
  let mailService: MailService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
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
    verificationService = await module.get(VerificationService);
    mailService = await module.get<MailService>(MailService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const CreatingUser = {
      email: '',
      password: '1234',
      role: 0,
    };

    const verification = {
      code: '',
      user: CreatingUser,
    };

    it('should create a new user', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(CreatingUser);
      userRepository.save.mockReturnValue(CreatingUser);

      verificationService.create.mockResolvedValue(verification);

      const result = await service.createAccount(CreatingUser);

      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(CreatingUser);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(CreatingUser);

      expect(verificationService.create).toHaveBeenCalledTimes(1);
      expect(verificationService.create).toHaveBeenCalledWith(CreatingUser);

      expect(mailService.sendVerifyEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerifyEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.save.mockRejectedValue(new Error());
      const result = await service.createAccount(CreatingUser);
      expect(result).toEqual({ ok: false, error: "Couldn't create account." });
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(CreatingUser);
      userRepository.save.mockReturnValue(CreatingUser);

      verificationService.create.mockRejectedValue(new Error());

      const result = await service.createAccount(CreatingUser);
      expect(result).toEqual({ ok: false, error: "Couldn't create account." });
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(CreatingUser);
      expect(result).toEqual({ ok: false, error: "Couldn't create account." });
    });

    it('should fail if user exists', async () => {
      userRepository.findOne.mockResolvedValue(CreatingUser);
      const result = await service.createAccount(CreatingUser);

      expect(result).toMatchObject({
        ok: false,
        error: 'The current email exists.',
      });
    });
  });

  describe('login', () => {
    const loginUser = { email: 'Mock@naver.com', password: '1234' };

    it("should fail if user doesn't exists", async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await service.login(loginUser);
      expect(result).toEqual({ ok: false, error: 'ID does not exist.' });
    });

    // it('should be login', () => {
    //   userRepository.findOne.mockResolvedValue({ id: 1, password: '1234' });
    //   const result = service.login(loginUser);
    //   expect(result).toEqual({ ok: true, user: { id: 1, password: '1234' } });
    // });
  });

  it.todo('getById');
  it.todo('editUser');
  it.todo('getAll');
});
