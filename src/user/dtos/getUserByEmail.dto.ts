import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetUserByEmailDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  @IsString({
    message: 'Please enter email as string',
  })
  email: string;
}
