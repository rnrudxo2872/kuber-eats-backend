import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TryCatch } from 'src/common/decorators/tryCatch.decorator';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { createAccountInput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly Users: Repository<User>,
    private readonly Config: ConfigService,
  ) {}

  async getAll(): Promise<User[]> {
    return this.Users.find({});
  }

  @TryCatch("Couldn't create account.")
  async createAccount({
    email,
    password,
    role,
  }: createAccountInput): Promise<{ ok: boolean; error?: string }> {
    const exists = await this.Users.findOne({ email });

    if (exists) {
      return { ok: false, error: 'The current email exists.' };
    }
    await this.Users.save(this.Users.create({ email, password, role }));
    return { ok: true };
  }

  @TryCatch('알맞지 않은 접근입니다!')
  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: any; token?: string }> {
    const user = await this.Users.findOne({ email });
    if (!user) {
      return { ok: false, error: 'ID does not exist.' };
    }

    const passwordCheck = await user.checkPassword(password);
    if (!passwordCheck) {
      return { ok: false, error: 'Passwords do not match.' };
    }

    const token = jwt.sign({ id: user.id }, this.Config.get('SECRET_KEY'), {
      algorithm: 'HS256',
    });

    return { ok: true, token };
  }
}
