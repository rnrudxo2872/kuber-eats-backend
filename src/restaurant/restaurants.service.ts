import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateRestaurantDTO } from './dtos/create-restaurant.dto';
import { updateRestaurantDTO } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantServcie {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find({});
  }

  createRestaurants(
    createRestaurant: CreateRestaurantDTO,
  ): Promise<Restaurant> {
    const newRestaurant = this.restaurants.create(createRestaurant);
    return this.restaurants.save(newRestaurant);
  }

  updateRestaurants({ id, data }: updateRestaurantDTO): Promise<UpdateResult> {
    return this.restaurants.update({ id }, { ...data });
  }
}
