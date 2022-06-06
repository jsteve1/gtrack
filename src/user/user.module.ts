import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignOnModule } from '../signon/signon.module';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GoalsModule } from '../goals/goals.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SignOnModule, forwardRef(() =>GoalsModule)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})

export class UserModule {}
