import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
  Patch,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { EditRestaurantDTO } from '../dtos/editRestaurant.dto';
import { MenuService } from '../services/menuItems.service';
import { MenuItemDTO } from '../dtos/addMenuItem.dto';

@Controller('menuItems')
@ApiTags('MenuItems')
export class MenuItemsController {
  constructor(private readonly menuItemService: MenuService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/addMenuItem')
  @ApiBody({
    type: MenuItemDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Endpoint to add menu item for a restaurant',
  })
  async addMenuItem(@Body() addMenuItem: MenuItemDTO) {
    return await this.menuItemService.addMenuItem(addMenuItem);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/editMenuItem/:id')
  @ApiBody({
    type: EditRestaurantDTO,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to edit an existing restaurant',
  })
  async editMenuItem(
    @Param('id') menuItemId: number,
    @Body() editRestaurant: EditRestaurantDTO,
  ) {
    return await this.menuItemService.editMenuItem(menuItemId, editRestaurant);
  }

  @Get('/fetchMenuItem/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to fetch an existing menuItem',
  })
  async getRestaurant(@Param('id') menuItemId: number) {
    return await this.menuItemService.fetchMenuItem(menuItemId);
  }

  @Get('/fetchMenuItems')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to fetch all menu items',
  })
  async getRestaurants() {
    return await this.menuItemService.fetchMenuItems();
  }

  @Get('/fetchRestaurantMenuItems/:restaurantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to fetch all restaurants',
  })
  async getMyRestaurants(@Param('restaurantId') restaurantId: number) {
    return await this.menuItemService.fetchRestaurantsMenuItems(restaurantId);
  }
}
