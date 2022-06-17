/** 
    2021 Jacob Stevens   
*/

import { Controller, Post, UseGuards, Req, Get, Logger, Query, Param, Body } from '@nestjs/common';
import { SignOnAuthGuard } from '../guards/signon.auth-guard';
import { Res } from '@nestjs/common';
import { SignOnService } from './signon.service';
import { Response } from 'express';
import JwtRefreshAuthGuard from '../guards/jwt-refresh.auth-guard';
import { User } from '../entities/user.entity';
import { MailService } from '../mail/mail.service';
import crypto from 'crypto'; 
import { NewPasswordDto } from 'src/entities/dto/userDto';

@Controller('signon')
export class SignonController {
  constructor(private signOnService: SignOnService, private mailService: MailService) {}

  private readonly logger = new Logger(SignonController.name);

  @UseGuards(SignOnAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    this.logger.log(`Logging in user and dishing out new JWT ${req.user.email}`);
    res.clearCookie('Refresh');
    const refreshToken = await this.signOnService.newRefreshToken(req.user);
    //await this.signOnService.loginUser(req.user);
    res.cookie('Refresh', refreshToken, { maxAge: 900000 }); 
    return { user: req.user }; 
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res() res: Response) {
    this.logger.log(`Logging out user and clearing tokens ${req.user.email}`);
    res.clearCookie('Refresh');
    res.send({ loggedOut: true })
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  async getRefreshToken(@Req() req, @Res() res: Response) {
    this.logger.log(`Dishing out new JWT for user ${req.user.email}`);
    res.clearCookie('Refresh');
    const newToken = await this.signOnService.newRefreshToken(req.user);
    res.cookie('Refresh', newToken, { maxAge: 900000, httpOnly: true }); 

    return res.send({ user: req.user });
  }

  @Get('confirm')
  async confirmUser(@Query('token') token, @Query('email') email): Promise<User | string> {
    const result = await this.signOnService.checkConfirm(email, token); 
    if(result === false) {
      this.logger.error(`Error: Account with user email ${email.length > 100 ? email.slice(0, 100) + "..." : email} confirmation error`); 
      return `Account confirmation error, deleted user with ${email.length > 100 ? email.slice(0, 100) + "..." : email} from database. Please try to sign up again`; 
    } else {
      this.logger.log(`Account with user email ${email.length > 100 ? email.slice(0, 100) + "..." : email} has successfully been confirmed`); 
      return result; 
    }
  }

  @Post('forgotpassword/:id')
  async forgotPassword(@Param('id') id): Promise<string> {
    this.logger.log(`Resetting password for user ${id}`);
    const token = crypto.randomBytes(48).toString('hex'); 
    const user = await this.signOnService.forgotPassword(id, token); 
    if(!user) {
      this.logger.error(`Error: cannot find user with email ${user.email}`); 
      return `Unable to send reset password email, user with id ${id} does not exist`; 
    } else {
      await this.mailService.resetPw(user, token);
      return `Reset Password email sent to ${user.email}`;
    }
  }

  @Post('newpw')
  async newPassword(@Res() res: Response, @Body() body: NewPasswordDto, @Query('token') token, @Query('email') email) {
    const { password } = body; 
    const user = await this.signOnService.checkPwResetToken(email, token); 
    if(user === false || user === true) {
      const msg = `Error: token provided for password reset for user ${email} doesn't match token in database, please try to reset your password again`; 
      this.logger.error(msg); 
      return msg; 
    } else {
        const _user = await this.signOnService.setNewPw(user.id, password); 
        if(_user) {
          this.logger.log(`User ${user.email} password has been successfully reset`); 
          return res.redirect('/'); 
        } else {
          this.logger.log(`Cannot set new password for user ${email}`); 
          return `Error resetting password for user, please try again`; 
        }
    }
  }
}

