import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { ApiResponseMessage } from '../responses';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { Request } from 'express';
import { UserService } from 'src/user/services/user.service';
import { UpdatePasswordDto } from '../dtos/updatePassword.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 200,
    description: 'User created',
    type: ApiResponseMessage,
  })
  @ApiOperation({
    summary: 'Create a new user and generate his access and refresh tokens',
  })
  async signUp(@Body() signupDTO: SignupDto) {
    return await this.authService.signUpLocal(signupDTO);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'User Logged In',
    type: ApiResponseMessage,
  })
  @ApiOperation({ summary: 'login using credentials' })
  async logIn(@Body() loginDTO: LoginDto) {
    return await this.authService.logIn(loginDTO);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Takes in a refresh token in API authorization header.Generate new tokens access and refresh both ',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Refresh token . Example "Bearer {token}"',
    example: 'Bearer <token>',
    allowEmptyValue: false,
    required: true,
  })
  async refreshToken(@Req() req: Request) {
    const user = req.user;

    return await this.authService.refreshTokens(
      user['sub'],
      user['refreshToken'],
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/updatePassword')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    type: ApiResponseMessage,
  })
  @ApiBody({
    type: UpdatePasswordDto,
  })
  @ApiOperation({ summary: 'Update user password' })
  async updatePassword(
    @Req() req: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.authService.updatePassword(
      req?.user['sub'],
      updatePasswordDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'User Logged Out',
    type: ApiResponseMessage,
  })
  @ApiOperation({ summary: 'user access to app is suspended' })
  async logOut(@Req() req: any) {
    return await this.authService.Logout(req.user['sub']);
  }
}
