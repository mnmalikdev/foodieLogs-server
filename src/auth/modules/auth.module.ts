import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthController } from '../controllers/auth.controller';
import { AtStrategy, RtStrategy } from '../stratergies';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/user/services/user.service';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AtStrategy, RtStrategy, AuthService, UserService],
})
export class AuthModule {}
