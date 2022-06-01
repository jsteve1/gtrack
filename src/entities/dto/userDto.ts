export class CreateUserDto {
    fname: string; 
    lname: string; 
    private: boolean; 
    media?: string[]; 
    mainpic?: number; 
    bio?: string; 
}