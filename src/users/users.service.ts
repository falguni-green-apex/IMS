import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserRolesEnum } from './entities/user.entity';
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

   /**Get all users */
   async getAllUsers(): Promise<ResponseDataPromise> {
    try {
      const userList = await this.userModel.find({ is_deleted: { "$ne": true }, "role": `${UserRolesEnum.USER}` }).select(['firstName', 'lastName', 'email', 'role', 'is_deleted']);
      if (userList.length) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Success',
          data: userList
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**Get user details by id */
  async getUserDetails(id: string): Promise<ResponseDataPromise> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.FOUND,
        message: 'Success',
        data: {
          userData: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            is_deleted: user.is_deleted
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**Edit user details */
  async editUser(id: string, data: UpdateUserDto): Promise<ResponseDataPromise> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user) {
        const updateData = {
          firstName: data?.firstName ? data.firstName : user.firstName,
          lastName: data?.lastName ? data.lastName : user.lastName
        }
        const result = await this.userModel.updateOne({ _id: id }, updateData);
        if (result.acknowledged) {
          return {
            statusCode: HttpStatus.OK,
            message: 'User updated successfully',
            data: {
              userData: {
                id: user.id,
                firstName: data.firstName || user.firstName,
                lastName: data.lastName || user.lastName,
              }
            }
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**Common fun to get user by id */
  async getUserById(id: string) {
    try {
      const user = await this.userModel.findOne({ _id: id, "is_deleted": { "$ne": true } });
      if (user) {
        return user;
      }
    } catch (error) {
      throw error;
    }
  }

  /**Delete user [Soft delete] */
  async deleteUser(id: string) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const result = await this.userModel.updateOne({ _id: id }, { is_deleted: true })
      if (result.acknowledged) {
        return {
          statusCode: HttpStatus.OK,
          message: 'User has been deleted successfully',
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
