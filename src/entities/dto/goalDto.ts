export class progressmarker {
    name: string; 
    complete: boolean; 
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