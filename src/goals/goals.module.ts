import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from '../entities/goal.entity';
import { GoalService } from './goal.provider';
import { GoalsController } from './goals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  providers: [GoalService],
  controllers: [GoalsController]
})
export class GoalsModule {}
