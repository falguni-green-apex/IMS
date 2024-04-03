import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CommonResponse, ResponseDataPromise } from 'src/utils/response.utils';
import { SignInUserDto } from 'src/users/dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService,
    ) { }
  
    /**New user sign up */
    async signUp(data: CreateUserDto): Promise<CommonResponse> {
      try {
          const result = await this.userService.createNewUser(data);
          if (result.statusCode === HttpStatus.CREATED) {
              return result;
          }
      } catch (error) {
          throw error;
      }
    }

      /**User sign in */
      async signIn(signInUserDto: SignInUserDto): Promise<ResponseDataPromise> {
        try {
            const result = await this.userService.signIn(signInUserDto);
            if (result.statusCode === HttpStatus.OK) {
                return result;
            }
        } catch (error) {
            throw error;
        }
      }
}
