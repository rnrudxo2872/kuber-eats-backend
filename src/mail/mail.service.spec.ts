import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { MAIL_CONFIG_OPTIONS } from './mail.constant';
import { MailService } from './mail.service';

const USER_NAME = 'Test User';
const CODE = 'Test code';

const mockMailerService = () => ({
  sendMail: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(() => 'Company email'),
});

type mailerServiceMock = Partial<Record<keyof MailerService, jest.Mock>>;
type configServiceMock = Partial<Record<keyof ConfigService, jest.Mock>>;

describe('MailService', () => {
  let service: MailService;
  let mailerService: mailerServiceMock;
  let configService: configServiceMock;

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
    mailerService = module.get(MailerService);
    configService = module.get(ConfigService);
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('snedEmail', () => {
    const MAIL_FROM = 'Mock_from';
    const SEND_INFO = {
      subject: 'Kuber Eats Email Verify',
      to: USER_NAME,
      html: `<h1>Please Verify Your Email</h1><div>Hello, ${USER_NAME}!</div><a href="http://127.0.0.1:3000?confirm=${CODE}"><button>Verify Email</button></a><div>Thanks for choosing Kuber Eats. </div>`,
    };

    it('should be called sendEamil', async () => {
      mailerService.sendMail.mockResolvedValue(true);
      configService.get.mockReturnValue(MAIL_FROM);

      const result = await service.sendEmail(SEND_INFO);

      expect(configService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalledWith('MAIL_FROM_EMAIL');

      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        from: MAIL_FROM,
        ...SEND_INFO,
      });

      expect(result).toBe(true);
    });

    it('should fail sendMail', async () => {
      mailerService.sendMail.mockRejectedValue(new Error());

      const result = await service.sendEmail(SEND_INFO);

      expect(result).toBe(false);
    });
  });

  describe('sendVerifyEmail', () => {
    it('should call sendEmail', async () => {
      const sendMailSpy = jest
        .spyOn(MailService.prototype as any, 'sendEmail')
        .mockImplementation(async () => {
          return true;
        });
      const result = await service.sendVerifyEmail(USER_NAME, CODE);

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
      expect(sendMailSpy).toHaveBeenCalledWith({
        subject: 'Kuber Eats Email Verify',
        to: USER_NAME,
        html: `<h1>Please Verify Your Email</h1><div>Hello, ${USER_NAME}!</div><a href="http://127.0.0.1:3000?confirm=${CODE}"><button>Verify Email</button></a><div>Thanks for choosing Kuber Eats. </div>`,
      });

      expect(result).toEqual(true);
    });

    it('should fail sendEmail', async () => {
      jest
        .spyOn(MailService.prototype as any, 'sendEmail')
        .mockImplementation(async () => {
          return false;
        });
      const result = await service.sendVerifyEmail(USER_NAME, CODE);

      expect(result).toEqual(false);
    });
  });
});
