import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MediaUpload, UploadType } from "../entities/media-upload.entity";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Goal } from "../entities/goal.entity";
import { open, stat, readFile, FileHandle, access, mkdir, writeFile, unlink } from 'fs/promises';
import path, { extname } from "path";
import { v4 } from "uuid";
import { UserService } from "../user/user.service";
import { GoalService } from "../goals/goal.service";
import { ProgressMarker } from "../entities/progressmarker.entity";
import fs from 'fs';
@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(MediaUpload) 
        private uploadRepo: Repository<MediaUpload>,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        @Inject(forwardRef(() => GoalService))
        private goalService: GoalService,
        ) {}

    async create(path: string, uploadType: UploadType, desc: string, userId: string): Promise<MediaUpload> {
        const upload = new MediaUpload()
        upload.path = path; 
        upload.uploadType = uploadType; 
        upload.desc = desc; 
        upload.userid = userId; 
        return upload;
    }

    async remove(id: string): Promise<void> {
        this.uploadRepo.delete(id);
    }

    async findOne(id: string): Promise<MediaUpload> {
        return this.uploadRepo.findOne(id); 
    }

    async setEntityId(id: string, entityId: string): Promise<MediaUpload> {
        const upload = await this.uploadRepo.findOne(id);
        if(!upload) return null; 
        upload.entityId = entityId; 
        return this.uploadRepo.save(upload); 
    }

    async getRelatedEntity(uploadId: string): Promise<User | { goal: Goal, progressMarkers: Array<ProgressMarker> }> {
        const upload = await this.uploadRepo.findOne(uploadId); 
        if(!upload || !upload.entityId) {
            return null; 
        }
        switch(upload.uploadType) {
            case UploadType.ProfilePic: 
                return this.userService.findOne(upload.entityId); 
            case UploadType.Goal: 
                return this.goalService.findOne(upload.entityId); ; 
            default: break;
        }
    }

    public async newUpload(userId: string, uploadType: UploadType, file: Express.Multer.File, goalId?: string): Promise<MediaUpload> {
        const upload = new MediaUpload(),
            tempFilePath = path.resolve(`./tmp/${file.originalname}`),
            ext = extname(`${file.originalname}`),
            uploadFileName = `upload-${v4()}${ext}`,     
            userDirPath = `uploads/${userId}/`,
            fullPath = userDirPath + uploadFileName,
            tempFd = await open(tempFilePath, 'r');

        if(!tempFd){ console.log('Cannot find temp file upload, failing new upload.'); return null; } 
        const tempFile = await tempFd.readFile({ encoding: 'base64' }); 
        if(!tempFile){ console.log("Critical fs error, failing new upload"); return null; }
        if(!(fs.existsSync(userDirPath))) await mkdir(userDirPath, { recursive: true });
        try {
            await writeFile(fullPath, tempFile, { encoding: 'base64' });
            await unlink(tempFilePath); 
            upload.uploadType = uploadType; 
            upload.path = fullPath; 
            upload.userid = userId;
            if(uploadType === UploadType.Goal) {
                upload.entityId = goalId; 
            }
            if(uploadType === UploadType.ProfilePic) {
                upload.entityId = userId;
            }
            return this.uploadRepo.save(upload); 
        } catch(err) {
            console.log('Error writing new file to user directory. User ID: ', userId, err);
            return null; 
        } finally {
            tempFd.close();      
        }
    }

    public async rmUpload(userId: string, uploadId: string): Promise<Boolean> {
        const user = await this.userService.findOne(userId); 
        if(!user) return false; 
        const upload = await this.uploadRepo.findOne(uploadId);
        if(!upload) return false; 
        if(upload.uploadType === UploadType.Goal) {
            await this.goalService.rmMedia(upload.entityId, upload.path); 
        }
        if(upload.uploadType === UploadType.ProfilePic) {
            await this.userService.rmMedia(upload.entityId, upload.path); 
        }
        await unlink(upload.path); 
        await this.uploadRepo.delete(uploadId);      
        return true;
    }

}