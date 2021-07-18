import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly Users: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return this.Users.find({});
  }

  async createAccount({
    email,
    password,
    role,
  }: createAccountInput): Promise<string | undefined> {
    try {
      const exists = await this.Users.findOne({ email });

      if (exists) {
        return 'The current email exists.';
      }
      await this.Users.save(this.Users.create({ email, password, role }));
      return;
    } catch (e) {
      console.log(e);
      return "Couldn't create account.";
    }
  }
}
