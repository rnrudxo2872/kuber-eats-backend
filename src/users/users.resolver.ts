import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TryCatch } from 'src/common/decorators/tryCatch.decorator';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
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
  async createAccount(
    @Args('input') createAccountInput: createAccountInput,
  ): Promise<createAccountOutput> {
    const { ok, error } = await this.usersService.createAccount(
      createAccountInput,
    );
    console.log(error);

    return { ok, error };
  }

  @Mutation((_) => LoginOutput)
  async login(@Args('input') inputLoginDTO: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(inputLoginDTO);
  }
}
