export class CreateGoalDto {
    name: string; 
    deadline: number; 
    userid: string;
    viewable?: boolean; 
    priority?: number; 
    reminders?: boolean; 
    media?: string[]; 
}