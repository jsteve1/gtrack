import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fname: string;

  @Column()
  lname: string;

  @Column()
  pw: string;

  @Column()
  sessionid: string;

  @Column()
  mainpic: string;

  @Column({ default: true })
  isActive: boolean;
}