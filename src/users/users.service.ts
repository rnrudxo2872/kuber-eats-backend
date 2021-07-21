import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TryCatch } from 'src/common/decorators/tryCatch.decorator';
import { Repository } from 'typeorm';
import { createAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditUserInput, EditUserOutput } from './dtos/user-edit.dto';
import { VerificationService } from 'src/verification/verification.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly Users: Repository<User>,
    private readonly verificationService: VerificationService,
    private readonly jwtService: JwtService,
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
      throw 'The current email exists.';
    }
    const user = await this.Users.save(
      this.Users.create({ email, password, role }),
    );
    await this.verificationService.create(user);
    return { ok: true };
  }

  @TryCatch('알맞지 않은 접근입니다!')
  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: any; token?: string }> {
    const user = await this.Users.findOne(
      { email },
      { select: ['id', 'password'] },
    );
    console.log(user);

    if (!user) {
      throw 'ID does not exist.';
    }

    const passwordCheck = await user.checkPassword(password);
    if (!passwordCheck) {
      throw 'Passwords do not match.';
    }

    const token = this.jwtService.sign(user.id);

    return { ok: true, token };
  }

  @TryCatch('해당하는 유저가 없습니다.')
  async getById(id) {
    return this.Users.findOne({ id });
  }

  @TryCatch('잘못된 요청입니다.')
  async editUser(
    id: number,
    EditUserInput: EditUserInput,
  ): Promise<EditUserOutput> {
    if (!EditUserInput || Object.keys(EditUserInput).length === 0) {
      throw Error();
    }

    const user = await this.Users.findOne({ id });

    if (EditUserInput.email) {
      user.email = EditUserInput.email;
      await this.verificationService.create(user);
    }

    if (EditUserInput.password) {
      user.password = EditUserInput.password;
    }

    await this.Users.save(user);
    return {
      ok: true,
    };
  }
}
