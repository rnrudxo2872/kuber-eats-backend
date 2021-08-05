import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { MAIL_CONFIG_OPTIONS } from './mail.constant';
import { MailService } from './mail.service';

const mockMailerService = () => ({
  sendMail: jest.fn(() => 'Send email'),
});

const mockConfigService = () => ({
  get: jest.fn(() => 'Company email'),
});

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MAIL_CONFIG_OPTIONS,
          useValue: {
            isGlobal: false,
            apiKey: '1234',
            domain: '1234',
            fromEmail: '1234',
          },
        },
        {
          provide: MailerService,
          useValue: mockMailerService(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });
});
