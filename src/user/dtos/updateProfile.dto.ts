import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({
    message: 'Please enter name as string',
  })
  userName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  @IsString({
    message: 'Please enter email as string',
  })
  email?: string;
}
