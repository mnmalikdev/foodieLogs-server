import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from '../services/user.service';
import { UpdateProfileDto } from '../dtos/updateProfile.dto';
import { GetUserByEmailDto } from '../dtos/getUserByEmail.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/updateProfile')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: UpdateProfileDto,
  })
  @ApiOperation({
    summary: 'Endpoint to update profile of user. each filed is optional',
  })
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(
      req.user['sub'],
      updateProfileDto,
    );
  }

  // TODO: Add the DTO
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/getUserByEmail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to get user by email',
  })
  async getUserByEmail(@Body() getUserByEmailDto: GetUserByEmailDto) {
    return await this.userService.fetchUserByEmail(getUserByEmailDto.email);
  }
}
