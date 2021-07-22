import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthContextUser } from 'src/auth/auth-user.guard';
import { TryCatch } from 'src/common/decorators/tryCatch.decorator';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EditUserInput, EditUserOutput } from './dtos/user-edit.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query((_) => String)
  sayHi() {
    return 'Hi';
  }

  @Mutation((_) => createAccountOutput)
  @TryCatch('There is a problem with the server.')
  createAccount(
    @Args('input') createAccountInput: createAccountInput,
  ): Promise<createAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((_) => LoginOutput)
  login(@Args('input') inputLoginDTO: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(inputLoginDTO);
  }

  @Query((_) => User)
  @UseGuards(AuthContextUser)
  me(@AuthUser() user: User) {
    return user;
  }

  @Query((_) => UserProfileOutput)
  @UseGuards(AuthContextUser)
  @TryCatch('오류입니다.')
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.getById(userProfileInput);
  }

  @Mutation((_) => EditUserOutput)
  @UseGuards(AuthContextUser)
  async editUser(
    @Args() EditUserInput: EditUserInput,
    @AuthUser() user,
  ): Promise<EditUserOutput> {
    console.log(user);

    return this.usersService.editUser(user.id, EditUserInput);
  }
}
