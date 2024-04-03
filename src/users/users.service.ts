import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import * as  bcrypt from 'bcryptjs'
import { Model } from 'mongoose';
import { SignInUserDto } from './dto/signin-user.dto';
import { ResponseDataPromise } from 'src/utils/response.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) { }

  /**User sign up */
  async createNewUser(data: CreateUserDto) {
    try {
      const userExist = await this.getUserByEmail(data.email);
      if (userExist) {
        throw new HttpException('Account from this email already exist', HttpStatus.BAD_REQUEST);
      }
      const password = await bcrypt.hash(data.password, 10);
      const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        password: password,
        role: data.role
      }
      const newUser = new this.userModel(user);
      const result = await newUser.save();
      if (result) {
        return {
          statusCode: HttpStatus.CREATED,
          message: 'You have signed up successfully',
        }
      }
    } catch (error) {
      throw error
    }
  }

  /**Get user by email */
  async getUserByEmail(email: string) {
    try {
      const userExist = await this.userModel.findOne({ email: email.toLowerCase(), "is_deleted": { "$ne": true } });
      if (userExist) {
        return userExist;
      }
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**User sign in */
  async signIn(data: SignInUserDto): Promise<ResponseDataPromise> {
    try {
      const user = await this.getUserByEmail(data.email);
      if (!user) {
        throw new HttpException('Account from this email not found', HttpStatus.BAD_REQUEST);
      }
      const comparePassword = await bcrypt.compare(data.password, user.password);
      if (!comparePassword) {
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }
      const tokenData = {
        sub: user.id,
        email: user.email,
        role: user.role
      }
      const token = await await this.jwtService.signAsync(tokenData);
      if (token) {
        return {
          statusCode: HttpStatus.OK,
          message: 'You have signed in successfully',
          data: {
            userData: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              is_deleted: user.is_deleted
            },
            token
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
