import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import * as bcrypt from 'bcrypt';
import { OnModuleDestroy } from "@nestjs/common";
import { SignOnService } from "../signon/signon.service";
import { CreateUserDto } from "../entities/dto/userDto";

@Injectable()
export class UserService implements OnModuleDestroy {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(forwardRef(() => SignOnService))
        private signOnService: SignOnService,
    ) {}

    async onModuleDestroy(): Promise<void> {
        console.log("Destroying user service, clearing cache, refresh tokens & location");
        await this.userRepository.update({}, {  refreshToken: '' });
    }
    async create(userDto: CreateUserDto): Promise<{ user: User, token: string }> {
        if(await this.checkUserExists(userDto.email)) {
            return null;
        }
        const user = new User();
        user.email = userDto.email;
        user.fname = userDto.fname; 
        user.lname = userDto.lname;
        user.private = userDto.private || false; 
        user.bio = userDto.bio || '';
        user.pw = await bcrypt.hash(userDto.pw, 10);
        const token = await this.signOnService.newRefreshToken(user);
        user.refreshToken = await bcrypt.hash(token, 10);
        await this.userRepository.save(user);
        return { user: user, token: token };
    }
    async checkUserExists(email: string): Promise<Boolean> {
        const count = (await this.userRepository.count({ where: [ { email: email } ] }));
        return count >= 1;
    }
    async checkStoredHashToken(email: string, refreshToken: string): Promise<User> {
        const user = await this.findEmail(email);
        if(user) {
            if(await bcrypt.compare(refreshToken, user.refreshToken)) {
                return user;
            }
        } else return null;
     }
    async findOne(id: string): Promise<User> {
        return this.userRepository.findOne(id); 
    }
    async findEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email: email }}); 
    }
    async findAll(): Promise<User[]> {
        return this.userRepository.find(); 
    }
    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
    async newPassword(id: string, pw: string): Promise<User> {
        const user = await this.userRepository.findOne(id);
        user.pw = await bcrypt.hash(pw, 10); 
        return this.userRepository.save(user); 
    }
    async updateToken(id: string, token: string): Promise<User> {
        const user = await this.userRepository.findOne(id); 
        user.refreshToken = await bcrypt.hash(token, 10);
        return this.userRepository.save(user);
    }
}