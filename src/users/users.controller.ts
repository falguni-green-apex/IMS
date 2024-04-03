import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/admin-auth.guard';
import { CommonResponse, ResponseDataPromise } from 'src/utils/response.utils';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    /**Get all users */
    @UseGuards(AdminAuthGuard)
    @Get()
    async getAllUsers(): Promise<ResponseDataPromise> {
      return await this.usersService.getAllUsers();
    }
  
    /**Get user data by id */
    @UseGuards(UserAuthGuard)
    @Get(':id')
    async getUserDetails(@Param('id') id: string): Promise<ResponseDataPromise> {
      return await this.usersService.getUserDetails(id);
    }
  
    /**Update user details */
    @UseGuards(UserAuthGuard)
    @Post('edit/:id')
    async editUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ResponseDataPromise> {
      return await this.usersService.editUser(id, updateUserDto);
    }
  
    /**Soft delete user */
    @UseGuards(UserAuthGuard)
    @Post('delete/:id')
    async deleteUser(@Param('id') id: string): Promise<CommonResponse> {
      return await this.usersService.deleteUser(id);
    }
}
