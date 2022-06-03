import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';

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

    async newRefreshToken(user: any) {
        const payload: jwtPayload = {
            username: user?.username, 
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
        if(isMatch) delete user.pw;
        return (isMatch) ? user : undefined;
    }

    async forgotPassword(user: any): Promise<Boolean> {
        return false;
    }
}