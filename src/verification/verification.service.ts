import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TryCatch } from 'src/common/decorators/tryCatch.decorator';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { VerificationInput, VerificationOutput } from './dtos/verification.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Verification)
    private readonly Verification: Repository<Verification>,
    @InjectRepository(User)
    private readonly User: Repository<User>,
  ) {}

  @TryCatch('Not Create Verification Entity.')
  async create(user: User) {
    const exists = await this.Verification.findOne({
      user: {
        id: user.id,
      },
    });
    if (exists) {
      exists.code = '1';
      exists.user = user;

      return await this.Verification.save(exists);
    }
    return await this.Verification.save(this.Verification.create({ user }));
  }

  @TryCatch('Not Found Verification Enttity')
  async findOne(user) {
    return await this.Verification.findOne({ user });
  }

  @TryCatch('Verify Email Error')
  async verifyEmail({ code }: VerificationInput): Promise<VerificationOutput> {
    const verification = await this.Verification.findOne(
      { code },
      { relations: ['user'] },
    );
    if (!verification) {
      throw Error();
    }
    verification.user.verify = true;
    console.log(verification);

    await this.User.save(verification.user);
    await this.Verification.delete(verification.id);
    return { ok: true };
  }
}
