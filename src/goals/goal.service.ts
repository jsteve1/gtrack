import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { Goal } from '../entities/goal.entity';
import { CreateGoalDto, UpdateGoalDto } from 'src/entities/dto/goalDto';
import { ProgressMarker } from 'src/entities/progressmarker.entity';

@Injectable()
export class GoalService {
    constructor(
        @InjectRepository(Goal)
        private goalRepo: Repository<Goal>,
        @InjectRepository(ProgressMarker)
        private progressMarkerRepo: Repository<ProgressMarker>,
        @Inject(forwardRef(() => UserService))
        private userService: UserService
      ) {}

      private readonly logger = new Logger(GoalService.name);

      async create(newGoal: CreateGoalDto, userId: string): Promise<{goal: Goal, progressMarkers: Array<ProgressMarker>}> {
        const user = await this.userService.findOne(userId);
        if(!user) return null; 
        const goal = new Goal();
        goal.userid = user.id; 
        goal.name = newGoal.name; 
        goal.deadline = newGoal.deadline; 
        goal.created = new Date().valueOf();  
        goal.starttime = newGoal.starttime || new Date().valueOf(); 
        goal.viewable = newGoal.viewable || true; 
        goal.priority = newGoal.priority || -1; 
        goal.reminders = newGoal.reminders || false;
        let _newGoal = await this.goalRepo.save(goal);
        let progressMarkers = [];
        if(newGoal.progressmarkers.length > 0) {
          for(let prgmrk of newGoal.progressmarkers) {
            const nmrker = new ProgressMarker(); 
            nmrker.deadline = prgmrk.deadline || newGoal.deadline; 
            nmrker.completed = false; 
            nmrker.goalid = _newGoal.id;
            nmrker.name = prgmrk.name; 
            progressMarkers.push(await this.progressMarkerRepo.save(nmrker)); 
          }
        }  
        return { goal: _newGoal, progressMarkers: progressMarkers };
    }

    async update(goalId: string, updateObj: UpdateGoalDto): Promise<Goal> {
      const goal = await this.goalRepo.findOne(goalId); 
      if(!goal) return null; 

      for(let key in updateObj) {
        if(goal[key] !== undefined) {
          goal[key] = updateObj[key]; 
        }
      }
      return this.goalRepo.save(goal); 
     }

    async getGoals(userId: string): Promise<{ goals: Goal[], progressMarkers: Array<ProgressMarker>}> {
      const _progressMarkers = [];  
      const goals = await this.goalRepo.find({ userid: userId }); 
      for(let goal of goals) {
        const progressMarkers = await this.progressMarkerRepo.find({ where: { goalid: goal.id }}); 
        _progressMarkers.push(...[progressMarkers]);
      }
      const _goals = goals.sort((a, b) => {
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
      return { goals: _goals, progressMarkers: _progressMarkers }; 
    }
    async findOne(goalId: string): Promise<{ goal: Goal, progressMarkers: Array<ProgressMarker>}> { 
      return { goal: await this.goalRepo.findOne(goalId), progressMarkers: await this.progressMarkerRepo.find({ where: { goalid: goalId }}) }
    }
    async markProgressDone(id: string): Promise<ProgressMarker> {
      const progressMarker = await this.progressMarkerRepo.findOne(id); 
      progressMarker.completed = true;
      progressMarker.completeddate = new Date().valueOf(); 
      return this.progressMarkerRepo.save(progressMarker); 
    }
    async markComplete(goalId: string): Promise<Goal> {
        const goal = await this.goalRepo.findOne(goalId);
        if(!goal) return null; 
        goal.complete = true; 
        const progressMarkers = await this.progressMarkerRepo.find({ where: { goalid: goalId }}); 
        for(let prgmrk of progressMarkers) {
          prgmrk.completed = true; 
          prgmrk.completeddate = new Date().valueOf(); 
          await this.progressMarkerRepo.save(prgmrk);
        }
        return this.goalRepo.save(goal); 
    }
    async remove(goalId: string): Promise<string> {
      const progressMarkers = await this.progressMarkerRepo.find({ where: { goalid: goalId }}); 
      for(let prgmrk of progressMarkers) {
        this.progressMarkerRepo.delete(prgmrk.id);
      }
      this.goalRepo.delete(goalId);
      return `Successfully removed goal ${goalId}`;
    }
    async addProgressMarker(goalId: string, createProg: any): Promise<ProgressMarker> {
      const goal = await this.goalRepo.findOne(goalId); 
      if(!goal) {
        return null; 
      }
      const progressMarkers = await this.progressMarkerRepo.find({ where: { goalid: goal.id }}); 
      if(progressMarkers.some(marker => marker.name === createProg.name )) {
        return null; 
      }
      const _newP = new ProgressMarker(); 
      _newP.name = createProg.name; 
      _newP.deadline = createProg.deadline; 
      _newP.completed = false; 
      _newP.goalid = goal.id; 
      return this.progressMarkerRepo.save(_newP); 
    }
    async removeProgressMarker(markerId: string) {
      this.progressMarkerRepo.delete(markerId); 
    }
    async addMedia(id: string, path: string): Promise<Goal> {
      const goal = await this.goalRepo.findOne(id); 
      if(goal.media.some(pic => pic === path)) {
        goal.media = goal.media.filter(pic => pic !== path); 
        goal.media.push(path); 
        return this.goalRepo.save(goal); 
      } else {
        goal.media.push(path); 
        return this.goalRepo.save(goal); 
      }
    }
    async rmMedia(id: string, path: string): Promise<Goal> {
      const goal = await this.goalRepo.findOne(id); 
        if(!goal.media.some(pic => pic === goal.mediacomplete)) {
            goal.mediacomplete = "";
        }
        goal.media = goal.media.filter(pic => 
            pic !== path 
        );
        return this.goalRepo.save(goal); 
    }
}