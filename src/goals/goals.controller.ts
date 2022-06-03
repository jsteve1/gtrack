import { Controller, Post, Body, UseGuards, Req, Put, Get, Delete, Logger, Param } from '@nestjs/common';
import { Goal } from '../entities/goal.entity';
import { GoalService } from './goal.service';
import { UserService } from '../user/user.service';
import JwtRefreshAuthGuard from '../guards/jwt-refresh.auth-guard';
import { CreateGoalDto } from '../entities/dto/goalDto';

@Controller('goal')
@UseGuards(new JwtRefreshAuthGuard())
export class GoalController {
  constructor(private goalService: GoalService
                    ) {}

  private readonly logger = new Logger(GoalController.name);

  @Get('/user')
  async getUserGoals(@Req() req): Promise<Goal[]> {
    this.logger.log(`Get goals for user ${req.user.email}`);
    return this.goalService.getGoals(req.user.id); 
  }

  @Get(':id')
  async getGoal(@Param('id') goalId: string): Promise<Goal> {
    this.logger.log(`Get goal ${goalId}`);
    return this.goalService.findOne(goalId);
  }

  @Post('create')
  async addGoal(@Req() req, @Body() newGoal: CreateGoalDto): Promise<Goal> {
    this.logger.log(`Create goal by user ${req.user.email}`);
    return this.goalService.create(newGoal, req.user.id);
  }

  @Put('progress/:id/:index')
  async setProgress(@Req() req, @Param('id') goalId, @Param('index') index): Promise<Goal> {
    this.logger.log(`Setting progress on goal for user ${req.user.email}`);
    return this.goalService.markProgressDone(goalId, index); 
  }

  @Delete(':id')
  async deleteGoal(@Req() req, @Param('id') goalId: string): Promise<void> {
    this.logger.log(`Remove goal by user ${req.user.userName}`);
    return this.goalService.remove(goalId);
  }

}
