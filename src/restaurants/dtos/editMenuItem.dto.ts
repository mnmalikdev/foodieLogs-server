import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EditMenuItemDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  review?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  restaurantId?: number;
}
