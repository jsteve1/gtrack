export class CreateUserDto {
    fname: string; 
    lname: string; 
    email: string;
    pw: string;
    private: boolean; 
    media?: string[]; 
    mainpic?: string; 
    bio?: string; 
}

export class UpdateUserDto {
    fname?: string; 
    lname?: string; 
    private?: boolean; 
    media?: string[]; 
    mainpic?: string;
    bio?: string; 
}