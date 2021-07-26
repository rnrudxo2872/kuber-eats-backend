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

const mockVerificationService = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  verifyEmail: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'This is jwt return token.'),
  verify: jest.fn(),
});

const mockMailService = () => ({
  sendVerifyEmail: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type verificationServiceMock = Partial<
  Record<keyof VerificationService, jest.Mock>
>;

describe('UserService', () => {
  let service: UsersService;
  let verificationService: verificationServiceMock;
  let jwtService: JwtService;
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
          useValue: mockVerificationService(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();

    service = await module.get<UsersService>(UsersService);
    verificationService = await module.get(VerificationService);
    jwtService = await module.get<JwtService>(JwtService);
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

    it('should throw Exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginUser);
      expect(result).toEqual({ ok: false, error: 'Can not login.' });
    });

    it("should fail if user doesn't exists", async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await service.login(loginUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({ ok: false, error: 'ID does not exist.' });
    });

    it('should fail if password is wrong.', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginUser);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );

      expect(result).toEqual({ ok: false, error: 'Passwords do not match.' });
    });

    it('should be login', async () => {
      const mockUser = {
        id: 1,
        checkPassword: jest
          .fn()
          .mockImplementation(() => Promise.resolve(true)),
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.login(loginUser);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));

      expect(result).toEqual({ ok: true, token: 'This is jwt return token.' });
    });
  });

  describe('getById', () => {
    const mockUser = {
      id: 1,
      email: 'Mock',
    };
    const findArgs = {
      id: 1,
    };

    it('should find an User.', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.getById(findArgs);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(expect.any(Object));

      expect(result).toEqual({ ok: true, user: mockUser });
    });

    it('should fail if no exist User.', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await service.getById(findArgs);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(expect.any(Object));

      expect(result).toEqual({ ok: false, error: '해당하는 유저가 없습니다.' });
    });
  });

  describe('editUser', () => {
    it('should change email', async () => {
      const oldUser = {
        id: 1,
        email: 'oldMock@gmail.com',
        verify: true,
      };

      const newUser = {
        id: 1,
        EditUserInput: {
          email: 'newMock@gmail.com',
          verify: false,
        },
      };

      const newVerfication = {
        code: 'This is verfiy code.',
      };

      userRepository.findOne.mockResolvedValue(oldUser);
      verificationService.create.mockResolvedValue(newVerfication);

      const result = await service.editUser(newUser.id, newUser.EditUserInput);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ id: newUser.id });

      expect(verificationService.create).toHaveBeenCalledTimes(1);
      expect(verificationService.create).toHaveBeenCalledWith(oldUser);

      expect(mailService.sendVerifyEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerifyEmail).toHaveBeenCalledWith(
        newUser.EditUserInput.email,
        newVerfication.code,
      );

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(oldUser);

      expect(result).toEqual({ ok: true });
    });

    it('should change password', async () => {
      const oldUser = {
        id: 1,
        password: 'oldMock123',
        verify: true,
      };

      const newUser = {
        id: 1,
        EditUserInput: {
          password: 'newMock123',
        },
      };

      const { id, EditUserInput } = newUser;

      userRepository.findOne.mockResolvedValue(oldUser);

      const result = await service.editUser(id, EditUserInput);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ id });

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(oldUser);

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editUser(1, { email: 'Mock@gmail.com' });
      expect(result).toEqual({ ok: false, error: '잘못된 요청입니다.' });
    });
  });

  it.todo('getAll');
});
