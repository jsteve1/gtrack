export class progressmarker {
    name: string; 
    complete: boolean;
    deadline?: number;  
}

export class CreateGoalDto {
    name: string; 
    deadline: number; 
    userid: string;
    viewable?: boolean; 
    priority?: number; 
    reminders?: boolean; 
    media?: string[]; 
    starttime?: number; 
    progressmarkers?: Array<progressmarker>;
}

export class UpdateGoalDto {
    name?: string;
    deadline?: number; 
    viewable?: boolean;
    priority?: number; 
    reminders?: boolean; 
    media?: string[]; 
    starttime?: number; 
    mediacomplete?: string; 
    postponed?: boolean;
}