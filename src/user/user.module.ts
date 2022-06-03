import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignOnModule } from '../signon/signon.module';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SignOnModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})

export class UserModule {}
