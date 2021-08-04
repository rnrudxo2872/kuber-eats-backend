import { Test } from '@nestjs/testing';
import { JWT_CONFIG_OPTIONS } from './jwt.constant';
import { JwtService } from './jwt.service';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'Mock Token'),
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
      const result = service.sign(1);
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, TEST_KEY, {
        algorithm: 'HS256',
      });
      expect(jwt.sign).toHaveBeenCalledTimes(1);

      expect(typeof result).toEqual('string');
      //expect(typeof result).toBe('string) => true
    });
  });

  describe('verify', () => {
    it.todo('verify');
  });
});
