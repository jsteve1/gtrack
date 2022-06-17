import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';
import { User } from "../entities/user.entity";

export interface jwtPayload {
    username: string,
    sub: string 
 }

@Injectable()
export class SignOnService {
    constructor(
                @Inject(forwardRef(() => UserService))
                private userService: UserService,
                private jwtService: JwtService
        ) { }

    private readonly logger = new Logger(SignOnService.name);

    async newRefreshToken(user: any) {
        const payload: jwtPayload = {
            username: user?.email, 
            sub: user?.id
        }
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_SECRET,
            expiresIn: '900s'
        });
        await this.userService.updateToken(user?.id, refreshToken); 
        return refreshToken;
    }
    
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findEmail(email); 
        const isMatch = await bcrypt.compare(password, user.pw); 
        if(isMatch) {
            delete user.pw; 
            delete user.refreshToken;
            delete user.confirmationToken; 
            delete user.resetPwToken; 
        }
        return (isMatch) ? user : undefined;
    }

    async checkConfirm(email: string, token: string): Promise<any> {
        const user = await this.userService.findEmail(email);
        if(user.confirmationToken === token) {
            const _user = await this.userService.confirmUser(user);
            delete _user.pw; 
            delete _user.confirmationToken; 
            delete _user.refreshToken;
            delete _user.resetPwToken;
            return _user;
        } else {
            const result = await this.userService.deleteUser(email); 
            if(result === false) {
                this.logger.error(`Error deleting user with email ${email}; user isn't in the database`); 
            }
            return false; 
        }
    }

    async checkPwResetToken(email: string, token: string): Promise<User | boolean> {
        const user = await this.userService.findEmail(email);
        if(user.resetPwToken === token) {
            delete user.pw; 
            delete user.refreshToken; 
            delete user.confirmationToken;
            delete user.resetPwToken; 
            return user;     
        } else {
            this.logger.error(`Error resetting password for user with email ${email}; provided reset token doesn't match `); 
            return false; 
        } 
    }

    async setNewPw(userId: string, newPw: string): Promise<User> {
        return this.userService.setNewPW(userId, newPw); 
    }

    async forgotPassword(userId: string, token: string): Promise<User> {
        return this.userService.pwReset(userId, token);
    }
}