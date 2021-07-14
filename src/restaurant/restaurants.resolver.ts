import { Args, Query, Resolver } from '@nestjs/graphql';
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
}
