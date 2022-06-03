import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { Goal } from '../entities/goal.entity';
import { CreateGoalDto } from 'src/entities/dto/goalDto';

@Injectable()
export class GoalService {
    constructor(
        @InjectRepository(Goal)
        private goalRepo: Repository<Goal>,
        private userService: UserService
      ) {}

      private readonly logger = new Logger(GoalService.name);

      async create(newGoal: CreateGoalDto, userId: string): Promise<Goal> {
        const user = await this.userService.findOne(userId);
        if(!user) return null; 
        const goal = new Goal();
        goal.userid = user.id; 
        goal.name = newGoal.name; 
        goal.deadline = newGoal.deadline; 
        goal.created = Date.now(); 
        goal.starttime = newGoal.starttime || Date.now()
        goal.viewable = newGoal.viewable || true; 
        goal.priority = newGoal.priority || -1; 
        goal.reminders = newGoal.reminders || false;
        goal.progressmarkers = newGoal.progressmarkers || []; 
        return this.goalRepo.save(goal);  
    }

    async getGoals(userId: string): Promise<Goal[]> {
      const goals = await this.goalRepo.find({ userid: userId }); 
      return goals.sort((a, b) => {
        if(a.priority > b.priority) {
          return 1; 
        }
        if(a.priority < b.priority) {
          return -1; 
        }
        if(a.priority === b.priority) {
          return a.deadline - b.deadline; 
        }
      });
    }

    async findOne(goalId: string): Promise<Goal> {
      return this.goalRepo.findOne(goalId);
    }

    async markProgressDone(goalId: string, index: number): Promise<Goal> {
      const goal = await this.goalRepo.findOne(goalId);
      if(goal.progressmarkers.length > index) {
        goal.progressmarkers[index].complete = true;  
      } else {
        this.logger.log("Goal progress marker not able to be marked as complete, index out of bounds"); 
      }
      return this.goalRepo.save(goal); 
    }
    async markComplete(goalId: string): Promise<Goal> {
        const goal = await this.goalRepo.findOne(goalId);
        if(!goal) return null; 
        goal.complete = true; 
        return goal; 
    }
    async remove(goalId: string): Promise<void> {
        this.goalRepo.delete(goalId);
    }
}