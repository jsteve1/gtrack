import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Goal } from '../entities/goal.entity';
import { GoalService } from './goal.service';
import { GoalController } from './goals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Goal]), UserModule],
  providers: [GoalService],
  controllers: [GoalController],
  exports: [GoalService]
})
export class GoalsModule {}
