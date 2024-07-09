import {
  Controller,
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
}
