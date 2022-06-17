 import { Strategy } from 'passport-local';
 import { PassportStrategy } from '@nestjs/passport';
 import { Injectable, Logger } from '@nestjs/common';
 import { SignOnService } from '../../signon/signon.service';
import { UserService } from '../../user/user.service';
 
 @Injectable()
 export class SignOnStrategy extends PassportStrategy(Strategy, "signon") {
   constructor(private signonService: SignOnService, private userService: UserService) {
     super({
       usernameField: 'email'
     });
   }
   private readonly logger = new Logger(SignOnStrategy.name); 
   /**
    * This guard is only called when login is called. 
    * @param email The email of the user trying to login
    * @param password The pw of the user
    */
   async validate(email: string, password: string): Promise<any> {
     const check = await this.userService.checkUserConfirmed(email); 
     if(check === false) {
      this.logger.error(`Error: User ${email} is attempting to login but hasn't confirmed their account yet`); 
      return false;
    }
     const user = await this.signonService.validateUser(email, password);
     if (!user) {
       console.log("Unable to validate user with email: ", email);
       return false;
     }
     return user;
   }
 }