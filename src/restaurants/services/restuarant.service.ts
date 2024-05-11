import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { RestaurantDTO } from '../dtos/addRestaurant.dto';
import { EditRestaurantDTO } from '../dtos/editRestaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    public restaurantRepository: Repository<Restaurant>,
  ) {}

  async addRestaurant(userId: number, addRestaurantDto: RestaurantDTO) {
    const restaurant = new Restaurant();
    restaurant.name = addRestaurantDto?.name;
    restaurant.location = addRestaurantDto?.location;
    restaurant.price = addRestaurantDto?.price;
    restaurant.rating = addRestaurantDto?.rating;
    restaurant.review = addRestaurantDto?.review;
    restaurant.features = JSON.stringify(addRestaurantDto?.features);
    restaurant.categories = JSON.stringify(addRestaurantDto?.categories);
    restaurant.user = <any>{ id: userId };
    await this.restaurantRepository.save(restaurant);

    return {
      status: 200,
      message: 'Restaurant saved',
      data: restaurant,
    };
  }

  async editRestaurant(
    restaurantId: number,
    editRestaurantDto: EditRestaurantDTO,
  ) {
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id: restaurantId,
      },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (editRestaurantDto?.name) {
      restaurant.name = editRestaurantDto?.name;
    }

    if (editRestaurantDto.location) {
      restaurant.location = editRestaurantDto.location;
    }
    if (editRestaurantDto.review) {
      restaurant.review = editRestaurantDto.review;
    }
    if (editRestaurantDto.rating) {
      restaurant.rating = editRestaurantDto.rating;
    }
    if (editRestaurantDto.price) {
      restaurant.price = editRestaurantDto.price;
    }
    if (editRestaurantDto.features) {
      restaurant.features = JSON.stringify(editRestaurantDto.features);
    }
    if (editRestaurantDto.categories) {
      restaurant.categories = JSON.stringify(editRestaurantDto.categories);
    }
    await this.restaurantRepository.save(restaurant);

    return {
      status: 200,
      message: 'Restaurant saved',
      data: restaurant,
    };
  }

  async fetchRestaurant(restaurantId: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id: restaurantId,
      },
      relations: {
        user: true,
        menuItems: true,
      },
      select: {
        user: {
          id: true,
          userName: true,
          email: true,
        },
      },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return {
      status: 200,
      message: 'Restaurant fetched',
      data: restaurant,
    };
  }

  async deleteRestaurant(restaurantId: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id: restaurantId,
      },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    await this.restaurantRepository.delete({
      id: restaurant.id,
    });
  }

  async fetchMyRestaurants(userId: number) {
    const restaurants = await this.restaurantRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
        menuItems: true,
      },
      select: {
        user: {
          id: true,
          userName: true,
          email: true,
        },
      },
    });
    return {
      status: 200,
      message: 'User Restaurants fetched',
      data: restaurants,
    };
  }

  async fetchRestaurants() {
    const restaurants = await this.restaurantRepository.find({
      relations: {
        user: true,
        menuItems: true,
      },
      select: {
        user: {
          id: true,
          userName: true,
          email: true,
        },
      },
    });
    return {
      status: 200,
      message: 'Restaurants fetched',
      data: restaurants,
    };
  }
}
