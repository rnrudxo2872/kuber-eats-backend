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
    @Args('input') createRestaurantDTO: CreateRestaurantDTO,
  ): Promise<boolean> {
    try {
      console.log(createRestaurantDTO);

      await this.restaurantService.createRestaurants(createRestaurantDTO);
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    }
  }
}
