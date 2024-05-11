import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Body,
  Patch,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

import { Request } from 'express';
import { RestaurantDTO } from '../dtos/addRestaurant.dto';
import { RestaurantService } from '../services/restuarant.service';
import { EditRestaurantDTO } from '../dtos/editRestaurant.dto';

@Controller('restaurants')
@ApiTags('Restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/addRestaurant')
  @ApiBody({
    type: RestaurantDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Endpoint to add restaurant',
  })
  async addRestaurant(
    @Req() req: Request,
    @Body() addRestaurant: RestaurantDTO,
  ) {
    return await this.restaurantService.addRestaurant(
      req.user['sub'],
      addRestaurant,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/editRestaurant/:id')
  @ApiBody({
    type: EditRestaurantDTO,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to edit an existing restaurant',
  })
  async editRestaurant(
    @Param('id') restaurantId: number,
    @Body() editRestaurant: EditRestaurantDTO,
  ) {
    return await this.restaurantService.editRestaurant(
      restaurantId,
      editRestaurant,
    );
  }

  @Get('/fetchRestaurant/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to fetch an existing restaurant',
  })
  async getRestaurant(@Param('id') restaurantId: number) {
    return await this.restaurantService.fetchRestaurant(restaurantId);
  }

  @Get('/fetchRestaurants')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to fetch all restaurants',
  })
  async getRestaurants() {
    return await this.restaurantService.fetchRestaurants();
  }

  @Get('/fetchMyRestaurants/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to fetch all restaurants',
  })
  async getMyRestaurants(@Param('userId') userId: number) {
    return await this.restaurantService.fetchMyRestaurants(userId);
  }
}
