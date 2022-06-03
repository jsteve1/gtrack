/**
 * 2021 Jacob Stevens
 * Strategy for extracting a JWT from the request cookie, and validating the request using the saved
 * hashed token in the database 
 */

 import { ExtractJwt, Strategy } from 'passport-jwt';
 import { PassportStrategy } from '@nestjs/passport';
 import { Injectable } from '@nestjs/common';
 import { Request } from 'express';
 import { UserService } from '../../user/user.service';
  
 @Injectable()
 export class JwtRefreshStrategy extends PassportStrategy(
   Strategy,
   'jwt'
 ) {
   constructor(
     private readonly userService: UserService
   ) {
     super({
       jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
         return request?.cookies?.Refresh;
       }]),
       secretOrKey: process.env.REFRESH_SECRET,
       passReqToCallback: true,
       ignoreExpiration: false
     });
   }
  
   /**
    * Method that performs the validation of the extracted refresh token 
    * @param request the request, exposing its cookies 
    * @param payload the JWT payload
    * @returns true if a match, false otherwise.
    */
   async validate(request: Request, payload: any): Promise<any> {
     const refreshToken = request.cookies?.Refresh;
     const user = await this.userService.checkStoredHashToken(payload.email, refreshToken);
     if(!user) return false;
     request.user = user;
     return user;
   }
   
 }