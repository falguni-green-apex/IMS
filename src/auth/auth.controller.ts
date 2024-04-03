import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CommonResponse, ResponseDataPromise } from 'src/utils/response.utils';
import { SignInUserDto } from 'src/users/dto/signin-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    /**User sign up */
    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<CommonResponse> {
      return await this.authService.signUp(createUserDto);
    }
  /**User sign in */
  @Post('signin')
  async signIn(@Body() signInUserDto: SignInUserDto): Promise<ResponseDataPromise> {
    return await this.authService.signIn(signInUserDto);
  }
}
