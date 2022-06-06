import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressMarker } from '../entities/progressmarker.entity';
import { UserModule } from '../user/user.module';
import { Goal } from '../entities/goal.entity';
import { GoalService } from './goal.service';
import { GoalController } from './goals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, ProgressMarker]), UserModule],
  providers: [GoalService],
  controllers: [GoalController],
  exports: [GoalService]
})
export class GoalsModule {}
