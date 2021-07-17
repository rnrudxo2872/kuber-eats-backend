import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
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
  async createAccount(
    @Args('input') createAccountInput: createAccountInput,
  ): Promise<createAccountOutput> {
    try {
      const error = await this.usersService.createAccount(createAccountInput);
      console.log(error);

      if (error) {
        return {
          ok: false,
          error,
        };
      }
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
