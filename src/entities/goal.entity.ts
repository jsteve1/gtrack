import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { progressmarker } from './dto/goalDto';

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
  viewable: boolean;

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

  @Column({ type: "simple-array" })
  progressmarkers: Array<progressmarker>;

  @Column()
  priority: number; 

}