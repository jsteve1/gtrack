/**
 * 2021 Jacob Stevens 
 */

 import { ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
 import { AuthGuard } from '@nestjs/passport';
 import { Request } from 'express'; 
import { CreateUserDto } from '../entities/dto/userDto';
import { MailService } from '../mail/mail.service';
import crypto from 'crypto'; 
 @Injectable()
 export class NewUserAuthGuard extends AuthGuard('newuser') {
   constructor(@Inject('MailService') private readonly mailService: MailService) { super() }

   private readonly logger = new Logger(NewUserAuthGuard.name);    

   async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        const user: CreateUserDto = JSON.parse(JSON.stringify(req.body)); 
        const token = crypto.randomBytes(48).toString('hex'); 
        const _user = await this.mailService.sendUserConfirmation(user, token);
        this.logger.log(`Confirmation email sent to ${user.email}, account needs to be confirmed before app usage allowed`);
        req.user = _user; 
        return true; 
  }
 }