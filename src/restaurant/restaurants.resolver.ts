import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDTO } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  @Query((_) => [Restaurant])
  myRestaurant(
    @Args('veganOnly', { nullable: true }) veganOnly: boolean,
  ): Restaurant[] {
    console.log(veganOnly);

    return [];
  }

  @Mutation((_) => Boolean)
  createRestaurant(@Args() CreateRestaurantDTO: CreateRestaurantDTO): boolean {
    console.log(CreateRestaurantDTO);

    return true;
  }
}
