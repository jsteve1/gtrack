/** 
    2021 Jacob Stevens   
*/

import { Controller, Post, Body, UseGuards, Req, Put, Get, Delete, Logger, Param, Res, Header, Query, Inject, forwardRef } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../entities/dto/userDto';
import JwtRefreshAuthGuard from '../guards/jwt-refresh.auth-guard';
import { User } from '../entities/user.entity';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { NewUserAuthGuard } from '../guards/newuser.auth-guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService
             ) {}

  private readonly logger = new Logger(UserController.name);

  @Get(':id')
  @UseGuards(JwtRefreshAuthGuard)
  async getUser(@Req() req: any, @Param('id') userId: string): Promise<User> {
      this.logger.log(`Attemping to fetch user ${userId}`);
      if(!req.user) return null; 
      if(req.user?.id === userId) return req.user; 
      else {
        this.logger.log(`Error while fetching user with ID: ${userId}, auth mismatch`);
        return null;
      }
  }

  @Post('create')
  @UseGuards(NewUserAuthGuard)
  async createUser(@Res() res: Response, @Body() newUser: CreateUserDto) {
      this.logger.log(`Creating new user with email ${newUser.email}`);
      res.clearCookie('Refresh');
      const result = await this.userService.create(newUser);
      if(!result || !result.user || !result.token) {
        this.logger.error(`User with email: ${newUser.email} already exists`); 
        return res.send({ error: "User with email already exists" })
      }
      res.cookie('Refresh', result.token, { maxAge: 900000, httpOnly: true });
      delete result.user.pw; 
      delete result.user.refreshToken; 
      this.logger.log(`New user created ${result.user.email}, refresh token created. Expires ${new Date(Date.now() + 900000).toISOString()}`);
      return res.send(result.user); 
    }

  @Put('update')
  @UseGuards(JwtRefreshAuthGuard)
  async updateUser(@Req() req: any, @Body() updateUserObj: UpdateUserDto): Promise<User> {
      this.logger.log(`Updating user  ${req.user.id}`); 
      const user = await this.userService.updateUserProfile(req.user.id, updateUserObj); 
      delete user.pw; 
      delete user.refreshToken;
      return user;
  }


  @Delete(':id')
  @UseGuards(JwtRefreshAuthGuard)
  async deleteUser(@Req() req, @Param('id') userId: string): Promise<void> {
    this.logger.log(`Deleting user ${userId}`);
    //if(req.user.email !== "admin") return null;
    this.logger.log(`Admin request for delete issued for user with ID: ${userId}`);
    return this.userService.remove(userId);
  }

  
}
