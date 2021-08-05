import { Test } from '@nestjs/testing';
import { JWT_CONFIG_OPTIONS } from './jwt.constant';
import { JwtService } from './jwt.service';
import * as jwt from 'jsonwebtoken';

const USER_ID = 1;
const MOCK_TOKEN = 'JWTtoken';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'Mock Token'),
    verify: jest.fn(() => ({
      id: USER_ID,
    })),
  };
});

const TEST_KEY = 'test-key';

describe('Jwt Service', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: JWT_CONFIG_OPTIONS,
          useValue: {
            secretKey: TEST_KEY,
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should return a signed token', () => {
      const result = service.sign(USER_ID);
      expect(jwt.sign).toHaveBeenCalledWith({ id: USER_ID }, TEST_KEY, {
        algorithm: 'HS256',
      });
      expect(jwt.sign).toHaveBeenCalledTimes(1);

      expect(typeof result).toEqual('string');
      //expect(typeof result).toBe('string) => true
    });
  });

  describe('verify', () => {
    it('should return the decode token', () => {
      const result = service.verify(MOCK_TOKEN);
      expect(result).toEqual({ id: USER_ID });
      expect(jwt.verify).toHaveBeenCalledWith(MOCK_TOKEN, TEST_KEY);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
    });
  });
});
