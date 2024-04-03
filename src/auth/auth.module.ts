import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv'
import { UsersService } from 'src/users/users.service';
dotenv.config()

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
  exports: [AuthService]
})
export class AuthModule { }
