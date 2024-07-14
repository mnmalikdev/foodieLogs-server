import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FavouriteDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({
    description: 'stringified menu item object',
  })
  @IsNotEmpty()
  menuItemObj: string;
}
