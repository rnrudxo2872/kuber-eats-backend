import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDTO } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantServcie } from './restaurants.service';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantServcie) {}

  @Query((_) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation((_) => Boolean)
  async createRestaurant(
    @Args() createRestaurantDTO: CreateRestaurantDTO,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createRestaurants(createRestaurantDTO);
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    }
  }
}
