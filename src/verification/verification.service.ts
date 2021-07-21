import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TryCatch } from 'src/common/decorators/tryCatch.decorator';
import { Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Verification)
    private readonly Verification: Repository<Verification>,
  ) {}

  @TryCatch('Not Create Verification Entity.')
  async create(user) {
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
}
