import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProgressMarker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  completed: boolean;

  @Column()
  completeddate: number;

  @Column()
  deadline: number;

  @Column()
  goalid: string; 
}