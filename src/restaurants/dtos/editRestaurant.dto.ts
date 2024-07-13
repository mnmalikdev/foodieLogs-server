import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class EditRestaurantDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'For example, Austin, Texas' })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsString()
  review: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  rating: number;

  @ApiProperty({
    description:
      'A constant number between 1 to 4 while 4 being most expensive and 1 being least expensive',
  })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({
    description: 'A stringified array that will be later parsed while fetching',
    example: [''],
  })
  @IsOptional()
  @IsArray()
  features: string[];

  @ApiProperty({
    description: 'A stringified array that will be later parsed while fetching',
    example: [''],
  })
  @IsOptional()
  @IsArray()
  categories: string[];

  @ApiProperty()
  @IsNumber()
  userId: number;
}
