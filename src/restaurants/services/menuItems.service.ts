import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../entities/menuItem.entity';
import { MenuItemDTO } from '../dtos/addMenuItem.dto';
import { EditMenuItemDTO } from '../dtos/editMenuItem.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    public menuRepository: Repository<MenuItem>,
  ) {}

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

    if (menuItem) {
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
    });

    if (menuItem) {
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
    });
    return {
      status: 200,
      message: 'Restaurant Menu Items fetched',
      data: restaurants,
    };
  }

  async fetchMenuItems() {
    const restaurants = await this.menuRepository.find();
    return {
      status: 200,
      message: 'Menu items fetched',
      data: restaurants,
    };
  }
}
