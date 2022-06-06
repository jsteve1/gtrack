import { Controller, Post, Body, UseGuards, Req, Put, Get, Delete, Logger, Param } from '@nestjs/common';
import { Goal } from '../entities/goal.entity';
import { GoalService } from './goal.service';
import { UserService } from '../user/user.service';
import JwtRefreshAuthGuard from '../guards/jwt-refresh.auth-guard';
import { CreateGoalDto, UpdateGoalDto } from '../entities/dto/goalDto';
import { ProgressMarker } from '../entities/progressmarker.entity';
import { ProgressMarkerDto } from '../entities/dto/progressMarkerDto';

@Controller('goal')
export class GoalController {
  constructor(private goalService: GoalService
                    ) {}

  private readonly logger = new Logger(GoalController.name);

  @Get('/user')
  @UseGuards(JwtRefreshAuthGuard)
  async getUserGoals(@Req() req): Promise<{ goals: Goal[], progressMarkers: Array<ProgressMarker>}> {
    this.logger.log(`Get goals for user ${req.user.email}`);
    return this.goalService.getGoals(req.user.id); 
  }

  @Get(':id')
  @UseGuards(JwtRefreshAuthGuard)
  async getGoal(@Param('id') goalId: string): Promise<{ goal: Goal, progressMarkers: Array<ProgressMarker>}> {
    this.logger.log(`Get goal ${goalId}`);
    return this.goalService.findOne(goalId);
  }

  @Post('create')
  @UseGuards(JwtRefreshAuthGuard)
  async addGoal(@Req() req, @Body() newGoal: CreateGoalDto): Promise<{ goal: Goal, progressMarkers: Array<ProgressMarker>}> {
    this.logger.log(`Create goal by user ${req.user.email}`);
    return this.goalService.create(newGoal, req.user.id);
  }

  @Put('update/:id')
  @UseGuards(JwtRefreshAuthGuard)
  async updateGoal(@Req() req, @Param('id') goalId, @Body() goalUpdate: UpdateGoalDto): Promise<{goal: Goal, progressMarkers: Array<ProgressMarker>}> {
    this.logger.log(`Updating goal information for goal ${goalId}`);
    await this.goalService.update(goalId, goalUpdate); 
    return this.goalService.findOne(goalId); 
  }

  @Put('progress/:progId')
  @UseGuards(JwtRefreshAuthGuard)
  async setProgressDone(@Req() req, @Param('progId') progressId): Promise<ProgressMarker> {
    this.logger.log(`Setting progress on goal for user ${req.user.email}`);
    return this.goalService.markProgressDone(progressId); 
  }

  @Put('/:goalId/addProgress')
  @UseGuards(JwtRefreshAuthGuard)
  async addProgressMarker(@Req() req, @Param('goalId') goalId, @Body() prgmkr: ProgressMarkerDto): Promise<{goal: Goal, progressMarkers: Array<ProgressMarker>}> {
    const { goal } = await this.goalService.findOne(goalId);
    this.logger.log(`Adding new progress marker for goal: ${goal.id}`);
    const progressMarker = await this.goalService.addProgressMarker(goal.id, prgmkr); 
    return this.goalService.findOne(goalId); 
  }
  
  @Delete(':progress/:progId')
  @UseGuards(JwtRefreshAuthGuard)
  async rmProgress(@Req() req, @Param('progId') progressId): Promise<void> {
    this.logger.log(`Removing progress on goal for user ${req.user.email}`);
    return this.goalService.removeProgressMarker(progressId); 
  }

  @Delete(':id')
  @UseGuards(JwtRefreshAuthGuard)
  async deleteGoal(@Req() req, @Param('id') goalId: string): Promise<void> {
    this.logger.log(`Remove goal by user ${req.user.userName}`);
    return this.goalService.remove(goalId);
  }
}
