import { ArrayUnique, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, maxLength, Min, MinLength } from 'class-validator';

export class CreateUserDto {
    @MinLength(1, {
        message: 'First name is too short (minimum 1 characters)',
    })
    @MaxLength(255, {
        message: 'First name is too long (maximum 255 characters)',
    })
    @IsNotEmpty()
    fname: string; 
    @MinLength(1, {
        message: 'Last name is too short (minimum 1 characters)',
    })
    @MaxLength(255, {
        message: 'Last name is too long (maximum 255 characters)',
    })
    @IsNotEmpty()
    lname: string; 
    @IsEmail()
    email: string;
    @MinLength(8, {
        message: 'Password is too short (minimum 8 characters)',
    })
    @MaxLength(100, {
        message: 'Password is too long (maximum 100 characters)',
    })
    @IsNotEmpty({ message: "Password cannot be empty"})
    @Matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%.,]).{8,100})/, {message: "Password must contain at least 1 digit, 1 lowercase letter, 1 uppercase letter, and one special character"})
    pw: string;
    @IsBoolean()
    private: boolean; 
    @ArrayUnique()
    @IsOptional()	
    media?: string[]; 
    @IsString()
    @IsOptional()	
    mainpic?: string; 
    @MinLength(1, {
        message: 'Bio must be at least 1 character',
    })
    @MaxLength(255, {
        message: 'Bio cannot be more than 1000 characters',
    })
    @IsString()
    @IsOptional()	
    bio?: string; 
}

export class UpdateUserDto {
    @IsOptional()	
    @MinLength(1, {
        message: 'First name is too short (minimum 1 characters)',
    })
    @MaxLength(255, {
        message: 'First name is too long (maximum 255 characters)',
    })
    fname?: string; 
    @IsOptional()	
    @MinLength(1, {
        message: 'Last name is too short (minimum 1 characters)',
    })
    @MaxLength(255, {
        message: 'Last name is too long (maximum 255 characters)',
    })
    lname?: string;
    @IsOptional()	 
    @IsBoolean()
    private?: boolean; 
    @IsOptional()	
    @ArrayUnique()
    media?: string[]; 
    @IsOptional()	
    @IsString()
    mainpic?: string;
    @MinLength(1, {
        message: 'Bio must be at least 1 character',
    })
    @MaxLength(255, {
        message: 'Bio cannot be more than 1000 characters',
    })
    @IsOptional()
    bio?: string; 
}