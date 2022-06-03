/**
 * 2021 Jacob Stevens 
 */

 import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
 import { AuthGuard } from '@nestjs/passport';
 import { Request } from 'express'; 
 
 @Injectable()
 export class NewUserAuthGuard extends AuthGuard('newuser') {

   private readonly logger = new Logger(NewUserAuthGuard.name);    

   canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        this.logger.log("New user auth guard allowing pass, in future will require token from admin page sent in email");
        return true; 
  }
 }