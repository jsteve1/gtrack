/** 
    2021 Jacob Stevens   
*/

import { Controller, Post, UseGuards, Req, Get, Logger, Header } from '@nestjs/common';
import { SignOnAuthGuard } from '../guards/signon.auth-guard';
import { Res } from '@nestjs/common';
import { SignOnService } from './signon.service';
import { Response } from 'express';
import JwtRefreshAuthGuard from '../guards/jwt-refresh.auth-guard';

@Controller('signon')
export class SignonController {
  constructor(private signOnService: SignOnService) {}

  private readonly logger = new Logger(SignonController.name);

  @UseGuards(SignOnAuthGuard)
  @Header("Access-Control-Allow-Credentials", "true")
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
    // if(!(await this.signOnService.logoutUser(req.user))){
    //   console.error("Cannot mark user as logged out. ID: ", req.user.id); 
    //   return res.status(500).send({ error: "logout failed" }); 
    // } else {
    // }
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

//   @Post('resetPassword')
//   async resetPassword(@Req() req, @Res() res: Response) {
//     this.logger.log(`Resetting password for user ${req.user.email}`);
//     //Clear password, send one time link to resetpw form to email
//     //return res.send()
//   }
}

