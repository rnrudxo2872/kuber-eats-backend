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
  getAll() {
    return true;
  }

  async createAccount({ email, password, role }: createAccountInput) {
    try {
      const exists = this.Users.findOne({ email });

      if (exists) {
        //exists Email => make error
        return;
      }
      this.Users.save(this.Users.create({ email, password, role }));
      return true;
    } catch (e) {
      console.log(e);
      return;
    }
  }
}
