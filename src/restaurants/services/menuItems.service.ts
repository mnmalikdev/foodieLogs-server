import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../entities/menuItem.entity';
import { MenuItemDTO } from '../dtos/addMenuItem.dto';
import { EditMenuItemDTO } from '../dtos/editMenuItem.dto';
import { ItemFilters, ItemOrders } from '../enums/FilterTypes';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    public menuRepository: Repository<MenuItem>,

    @InjectRepository(User)
    public userRepository: Repository<User>,
  ) { }

  async addMenuItem(addMenuItemDto: MenuItemDTO) {
    const menuItem = new MenuItem();

    menuItem.name = addMenuItemDto.name;
    menuItem.rating = addMenuItemDto.rating;
    menuItem.review = addMenuItemDto.review;
    menuItem.restaurant = <any>{ id: addMenuItemDto.restaurantId };

    await this.menuRepository.save(menuItem);

    return {
      status: 200,
      message: 'menu item saved',
      data: menuItem,
    };
  }

  async editMenuItem(menuItemId: number, editMenuItemDto: EditMenuItemDTO) {
    const menuItem = await this.menuRepository.findOne({
      where: {
        id: menuItemId,
      },
      relations: {
        restaurant: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    if (editMenuItemDto?.name) {
      menuItem.name = editMenuItemDto?.name;
    }
    if (editMenuItemDto?.review) {
      menuItem.review = editMenuItemDto?.review;
    }
    if (editMenuItemDto?.rating) {
      menuItem.rating = editMenuItemDto?.rating;
    }

    await this.menuRepository.save(menuItem);

    return {
      status: 200,
      message: 'menu item saved',
      data: menuItem,
    };
  }

  async fetchMenuItem(menuItemId: number) {
    const menuItem = await this.menuRepository.findOne({
      where: {
        id: menuItemId,
      },
      relations: {
        restaurant: true,
      },
      order: {
        id: 'DESC',
        restaurant: {
          id: 'DESC',
        },
      },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return {
      status: 200,
      message: 'menu item fetched',
      data: menuItem,
    };
  }

  async deleteMenuItem(menuItemId: number) {
    const menuItem = await this.menuRepository.findOne({
      where: {
        id: menuItemId,
      },
    });
    if (!menuItemId) {
      throw new NotFoundException('Menu item not found');
    }
    await this.menuRepository.delete({
      id: menuItem.id,
    });
  }

  async fetchRestaurantsMenuItems(restaurantId: number) {
    const restaurants = await this.menuRepository.find({
      where: {
        restaurant: {
          id: restaurantId,
        },
      },
      relations: {
        restaurant: true,
      },
      order: {
        id: 'DESC',
        restaurant: {
          id: 'DESC',
        },
      },
    });
    return {
      status: 200,
      message: 'Restaurant Menu Items fetched',
      data: restaurants,
    };
  }

  async fetchMenuItems(filterOption: ItemFilters, order: ItemOrders, userId: number) {

    const orderObject: any = {

    }

    if (filterOption === ItemFilters.Rating) {
      orderObject.rating = order
    } else if (filterOption === ItemFilters.Alphabetical) {
      orderObject.name = order
    }
    else {
      orderObject.rating = 'DESC'
    }


    console.log(orderObject)
    let restaurants = await this.menuRepository.find({
      order: orderObject,
      relations: {
        restaurant: true,
        favoritedBy: true,

      }
    });


    if (filterOption === ItemFilters.Favourite) {

      restaurants = restaurants.sort((a, b) => {
        const aFavorited = a.favoritedBy.some(user => user.id === userId);
        const bFavorited = b.favoritedBy.some(user => user.id === userId);

        if (aFavorited && !bFavorited) {
          return -1;
        } else if (!aFavorited && bFavorited) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    return {
      status: 200,
      message: 'Menu items fetched',
      data: restaurants,
    };
  }





  async addFavoriteMenuItem(userId: number, menuItemId: number): Promise<void> {

    console.log(userId, menuItemId)
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteMenuItems'],
    });
    const menuItem = await this.menuRepository.findOne({ where: { id: menuItemId } });

    console.log(user)
    console.log(menuItem)
    if (!user || !menuItem) {
      throw new Error('User or MenuItem not found');
    }

    user.favoriteMenuItems.push(menuItem);
    await this.userRepository.save(user);
  }
}
