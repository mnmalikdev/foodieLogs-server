import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class RestaurantDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'For example, Austin, Texas' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsString()
  review: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description:
      'A constant number between 1 to 4 while 4 being most expensive and 1 being least expensive',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'A stringified array that will be later parsed while fetching',
  })
  @IsArray()
  @IsNotEmpty()
  features: string[];

  @ApiProperty({
    description: 'A stringified array that will be later parsed while fetching',
  })
  @IsArray()
  @IsNotEmpty()
  categories: string[];

  @ApiProperty()
  @IsNumber()
  userId: number;
}
