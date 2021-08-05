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

  it.todo('sendEmail');
  describe('sendVerifyEmail', () => {
    it.todo('sendVerifiyEmail');
    it('should call sendEmail', async () => {
      const USER_NAME = 'Test User';
      const CODE = 'Test code';

      const sendMailSpy = jest
        .spyOn(MailService.prototype as any, 'sendEmail')
        .mockImplementation(async () => {});

      await service.sendVerifyEmail(USER_NAME, CODE);
      expect(sendMailSpy).toHaveBeenCalledTimes(1);
      expect(sendMailSpy).toHaveBeenCalledWith({
        subject: 'Kuber Eats Email Verify',
        to: USER_NAME,
        html: `<h1>Please Verify Your Email</h1><div>Hello, ${USER_NAME}!</div><a href="http://127.0.0.1:3000?confirm=${CODE}"><button>Verify Email</button></a><div>Thanks for choosing Kuber Eats. </div>`,
      });
    });
  });
});
