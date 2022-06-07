import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
 
export enum UploadType {
  ProfilePic = "ProfilePic", 
  Goal = "Goal"
}

 @Entity()  
 export class MediaUpload {
   @PrimaryGeneratedColumn("uuid")
   id: string
 
   @Column({ default: "" })
   path: string;

   @Column({ default: "" })
   entityId: string;

   @Column({ default: "" })
   desc: string;

   @Column({ type: "enum", enum: UploadType })
   uploadType: UploadType;
 
   @CreateDateColumn()
   createdAt: string;

   @Column()
   userid: string;
 }