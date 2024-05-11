import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { RestaurantService } from '../services/restuarant.service';
import { RestaurantController } from '../controllers/restaurants.controller';
import { MenuItem } from '../entities/menuItem.entity';
import { MenuItemsController } from '../controllers/menuItems.controller';
import { MenuService } from '../services/menuItems.service';
// import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, MenuItem])],
  controllers: [RestaurantController, MenuItemsController],
  providers: [RestaurantService, MenuService],
})
export class RestaurantModule {}
