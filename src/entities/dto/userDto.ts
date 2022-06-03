export class CreateUserDto {
    fname: string; 
    lname: string; 
    email: string;
    pw: string;
    private: boolean; 
    media?: string[]; 
    mainpic?: number; 
    bio?: string; 
}