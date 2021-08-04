import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { VerificationService } from 'src/verification/verification.service';
import { Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('VerificationService', () => {
  let service: VerificationService;
  let verificationRepository: MockRepository<Verification>;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        VerificationService,
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
    verificationRepository = module.get(getRepositoryToken(Verification));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const curUser = {
      id: 1,
      createAt: new Date(),
      updateAt: new Date(),
      email: 'mock@gmail.com',
      password: '1234',
      role: 0,
      verify: true,
      beforInsertDB: async () => {
        return;
      },
      checkPassword: async (pas: string) => {
        return true;
      },
    };

    it('should be updated', async () => {
      verificationRepository.findOne.mockResolvedValue({ code: '123' });
      verificationRepository.save.mockResolvedValue({ code: '123' });

      await service.create(curUser);
      expect(verificationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should be created', async () => {
      verificationRepository.findOne.mockResolvedValue(undefined);
      verificationRepository.create.mockReturnValue({ code: '1234' });

      await service.create(curUser);

      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });
  });

  describe('verifiy', () => {
    it('should verify', async () => {
      verificationRepository.findOne.mockResolvedValue({
        code: '1234',
        user: { verifiy: false },
      });
      const result = await service.verifyEmail({ code: '1234' });

      expect(verificationRepository.findOne).toHaveBeenCalledTimes(1);

      expect(userRepository.save).toHaveBeenCalledTimes(1);

      expect(verificationRepository.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
    });

    it('should throw error.', async () => {
      verificationRepository.findOne.mockRejectedValue(Error());
      const result = await service.verifyEmail({ code: '1234' });
      expect(result).toEqual({ ok: false, error: 'Verify Email Error' });
    });

    it('No exist verification', async () => {
      verificationRepository.findOne.mockResolvedValue(undefined);
      const result = await service.verifyEmail({ code: '1234' });
      expect(result).toEqual({ ok: false, error: 'Verify Email Error' });
    });
  });
});
