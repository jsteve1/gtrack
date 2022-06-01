import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  deadline: number;

  @Column()
  created: number;

  @Column()
  starttime: number; 

  @Column()
  postponed: boolean; 

  @Column()
  private: boolean;

  @Column()
  reminders: boolean;

  @Column()
  complete: boolean;

  @Column({ type: "simple-array" })
  media: string[];

  @Column() 
  mediacomplete: string; 
  
  @Column()
  userid: string; 

  @Column({ type: "simple-json" })
  progressmarkers: {};

}