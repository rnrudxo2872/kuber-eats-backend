import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDTO } from './dtos/create-restaurant.dto';
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
}
