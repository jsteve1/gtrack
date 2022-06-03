import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fname: string;

  @Column()
  lname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  pw: string;

  @Column()
  refreshToken: string;

  @Column()
  mainpic: string;

  @Column({ type: "simple-array" })
  pics: string[];

  @Column()
  private: boolean; 

  @Column()
  bio: string; 
  
}