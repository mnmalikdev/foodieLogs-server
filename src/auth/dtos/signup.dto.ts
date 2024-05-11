import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(3, {
    message: 'username is too short',
  })
  @IsNotEmpty()
  @ApiProperty()
  userName: string;

  @IsString()
  @MinLength(8, {
    message: 'Password is too short',
  })
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @MinLength(8, {
    message: 'Password is too short',
  })
  @IsNotEmpty()
  @ApiProperty()
  confirmPassword: string;
}
