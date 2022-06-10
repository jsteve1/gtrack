import { ArrayUnique, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, IsUUID, Max, MaxLength, maxLength, Min, MinLength } from 'class-validator';

export class ProgressMarkerDto {
    @MinLength(2, {
        message: 'Progress Marker name is too short (minimum 2 characters)',
    })
    @MaxLength(255, {
        message: 'Progress Marker name is too long (maximum 511 characters)',
    })
    name: string;
    @IsUUID('4', {
        message: 'Goal ID provided for progress marker is not a UUIDv4'
    })
    goalid: string; 
    @Min(1022894020, {
        message: 'Deadline date for progress marker cannot be before June 2002',
    })
    @Max(4083959620, {
        message: 'Deadline date for progress marker cannot be after June 2099',
    })
    deadline: number; 
}