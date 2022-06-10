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
    this.logger.log(`Attempting to fetch goals for user ${req.user.email}`);
    return this.goalService.getGoals(req.user.id); 
  }

  @Get(':id')
  @UseGuards(JwtRefreshAuthGuard)
  async getGoal(@Req() req, @Param('id') goalId: string): Promise<{ goal: Goal, progressMarkers: Array<ProgressMarker>} | string> {
    this.logger.log(`Attempting to fetch goal ${goalId}`);
    const { goal, progressMarkers } = await this.goalService.findOne(goalId);
    if(goal.userid !== req.user.id) {
      this.logger.log(`User ${req.user.id} requesting goal created by user ${goal.userid}`); 
      if(goal.viewable === false) {
        this.logger.error(`Error: User ${req.user.id} cannot request goal created by user ${goal.userid}; goal is marked as private`);
        return `Unable to fetch goal ${goal.id}; it's marked as private by user ${goal.userid}`;  
      } else {
        return { goal, progressMarkers }; 
      }
    } else {
      return { goal, progressMarkers }; 
    }
  }

  @Post('create')
  @UseGuards(JwtRefreshAuthGuard)
  async addGoal(@Req() req, @Body() newGoal: CreateGoalDto): Promise<{ goal: Goal, progressMarkers: Array<ProgressMarker>}> {
    this.logger.log(`Attempting to create goal by user ${req.user.email}`);
    return this.goalService.create(newGoal, req.user.id);
  }

  @Put('update/:id')
  @UseGuards(JwtRefreshAuthGuard)
  async updateGoal(@Req() req, @Param('id') goalId, @Body() goalUpdate: UpdateGoalDto): Promise<{goal: Goal, progressMarkers: Array<ProgressMarker>} | string> {
    this.logger.log(`Attempting to update goal ${goalId} by user ${req.user.id}`);
    const { goal, progressMarkers } = await this.goalService.findOne(goalId);
    if(goal.userid !== req.user.id) {
      this.logger.error(`Error: User ${req.user.id} cannot update a goal that wasn't created by them`);
      return `User ${req.user.id} cannot update a goal that was created by user ${goal.userid}`;
    } else {
      await this.goalService.update(goalId, goalUpdate); 
      return this.goalService.findOne(goalId); 
    }     
  }

  @Put('progress/:progId')
  @UseGuards(JwtRefreshAuthGuard)
  async setProgressDone(@Req() req, @Param('progId') progressId): Promise<ProgressMarker | string> {
    this.logger.log(`Attempting to mark progress done on goal for user ${req.user.email}`);
    const { progressMarkers } = await this.goalService.getGoals(req.user.id); 
    if(progressMarkers.some(prgmrkr => prgmrkr.id === progressId)) {
      return this.goalService.markProgressDone(progressId); 
    } else {
      this.logger.error(`Error: Progress marker ${progressId} does not exist for user ${req.user.id}`); 
      return `Cannot find progress marker ${progressId} for user ${req.user.id}`; 
    }
  }

  @Put('/:goalId/addProgress')
  @UseGuards(JwtRefreshAuthGuard)
  async addProgressMarker(@Req() req, @Param('goalId') goalId, @Body() prgmkr: ProgressMarkerDto): Promise<{goal: Goal, progressMarkers: Array<ProgressMarker>} | string> {
    this.logger.log(`Attempting to add progress marker to goal ${goalId} for user ${req.user.email}`);
    const { goal } = await this.goalService.findOne(goalId);
    if(goal.userid !== req.user.id) {
      this.logger.error(`Error: Goal ${goal.id} cannot be updated by user ${req.user.id}; goal created by user ${goal.userid}`);
      return `Cannot add progress marker to goal because it was created by a different user ${goal.userid}`; 
    } else {
      this.logger.log(`Adding new progress marker for goal: ${goal.id}`);
      const progressMarker = await this.goalService.addProgressMarker(goal.id, prgmkr); 
      return this.goalService.findOne(goalId); 
    }
  }
  
  @Delete(':progress/:progId')
  @UseGuards(JwtRefreshAuthGuard)
  async rmProgress(@Req() req, @Param('progId') progressId): Promise<string> {
    this.logger.log(`Attempting to remove progress marker ${progressId} on goal for user ${req.user.email}`);
    const { goals, progressMarkers } = await this.goalService.getGoals(req.user.id); 
    if(progressMarkers.some(prgmrkr => prgmrkr.id === progressId)) {
      await this.goalService.removeProgressMarker(progressId); 
      return `Successfully removed progress marker ${progressId} for user ${req.user.id}`; 
    } else {
      this.logger.error(`Error: Progress marker ${progressId} does not exist for user ${req.user.id}`); 
      return `Cannot remove progress marker ${progressId} for user ${req.user.id}`; 
    }
  }

  @Delete(':id')
  @UseGuards(JwtRefreshAuthGuard)
  async deleteGoal(@Req() req, @Param('id') goalId: string): Promise<string> {
    this.logger.log(`Attempting to remove goal by user ${req.user.id}`);
    const { goal } = await this.goalService.findOne(goalId);
    if(goal.userid !== req.user.id) {
      this.logger.error(`Error: User ${req.user.id} cannot remove goal created by user ${goal.userid}`);
      return `User ${req.user.id} cannot remove goal created by user ${goal.userid}`
    } else {
      return this.goalService.remove(goalId);
    }
  }
}
