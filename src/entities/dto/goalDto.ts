import { ArrayUnique, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, maxLength, Min, MinLength } from 'class-validator';


export class progressmarker {
    @MinLength(2, {
        message: 'Progress Marker name is too short (minimum 2 characters)',
    })
    @MaxLength(255, {
        message: 'Progress Marker name is too long (maximum 511 characters)',
    })
    @IsNotEmpty()
    name: string; 
    @IsBoolean()
    complete: boolean;
    @Min(1022894020, {
        message: 'Deadline date for progress marker cannot be before June 2002',
    })
    @Max(4083959620, {
        message: 'Deadline date for progress marker cannot be after June 2099',
    })
    @IsOptional()	
    deadline?: number;  
}

export class CreateGoalDto {
    @MinLength(2, {
        message: 'Goal name is too short (minimum 2 characters)',
      })
    @MaxLength(511, {
        message: 'Goal name is too long (maximum 511 characters)',
    })
    @IsNotEmpty()
    name: string;
    @Min(1022894020, {
        message: 'Deadline date for goal cannot be before June 2002',
    })
    @Max(4083959620, {
        message: 'Deadline date for goal cannot be after June 2099',
    })
    deadline: number; 
    @IsUUID('4', {
        message: 'User ID provided for goal is not a UUIDv4'
    })
    userid: string;
    @IsBoolean()
    viewable?: boolean; 
    @Min(0)
    @Max(500)
    @IsOptional()	
    priority?: number; 
    @IsBoolean()
    @IsOptional()	
    reminders?: boolean; 
    @ArrayUnique()
    @IsOptional()	
    media?: string[]; 
    @Min(1022894020, {
        message: 'Start time date for goal cannot be before June 2002',
    })
    @Max(4083959620, {
        message: 'Start time date for goal cannot be after June 2099',
    })
    @IsOptional()	
    starttime?: number; 
    @ArrayUnique(e => e.id)
    @IsOptional()	
    progressmarkers?: Array<progressmarker>;
}

export class UpdateGoalDto {
    @MinLength(2, {
        message: 'Goal name is too short (minimum 2 characters)',
      })
    @MaxLength(511, {
        message: 'Goal name is too long (maximum 511 characters)',
    })
    @IsOptional()	
    name?: string;
    @Min(1022894020, {
        message: 'Deadline date for goal cannot be before June 2002',
    })
    @Max(4083959620, {
        message: 'Deadline date for goal cannot be after June 2099',
    })
    @IsOptional()	
    deadline?: number; 
    @IsBoolean()
    @IsOptional()	
    viewable?: boolean;
    @Min(0)
    @Max(500)
    @IsOptional()	
    priority?: number; 
    @IsBoolean()
    @IsOptional()	
    reminders?: boolean; 
    @ArrayUnique()
    @IsOptional()	
    media?: string[]; 
    @Min(1022894020, {
        message: 'Start time date for goal cannot be before June 2002',
    })
    @Max(4083959620, {
        message: 'Start time date for goal cannot be after June 2099',
    })
    @IsOptional()	
    starttime?: number; 
    @IsString()
    @IsOptional()	
    mediacomplete?: string; 
    @IsBoolean()
    @IsOptional()	
    postponed?: boolean;
}