 import { Strategy } from 'passport-local';
 import { PassportStrategy } from '@nestjs/passport';
 import { Injectable } from '@nestjs/common';
 import { SignOnService } from '../../signon/signon.service';
 
 @Injectable()
 export class SignOnStrategy extends PassportStrategy(Strategy, "signon") {
   constructor(private signonService: SignOnService) {
     super({
       usernameField: 'userName'
     });
   }
   /**
    * This guard is only called when login is called. 
    * @param email The email of the user trying to login
    * @param password The pw of the user
    */
   async validate(email: string, password: string): Promise<any> {
     const user = await this.signonService.validateUser(email, password);
     if (!user) {
       console.log("Unable to validate user with email: ", email);
       return false;
     }
     return user;
   }
 }