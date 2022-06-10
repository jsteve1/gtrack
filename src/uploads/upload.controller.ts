import { Delete, forwardRef, Inject, Logger, Param, Req, UploadedFile, UseGuards } from "@nestjs/common";
import { UseInterceptors } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "../user/user.service";
import { UploadType } from "../entities/media-upload.entity";
import JwtRefreshAuthGuard from "../guards/jwt-refresh.auth-guard";
import { UploadService } from "./upload-file.service";
import { GoalService } from "src/goals/goal.service";
import { storage, limits, fileFilter } from "../config/uploads.config";

@Controller('upload')
export class UploadController {
    constructor(
                @Inject(forwardRef(() => UserService))
                private userService: UserService,
                @Inject(forwardRef(() => GoalService))
                private goalService: GoalService,
                private uploadService: UploadService
        ) {}

    private readonly logger = new Logger(UploadController.name);
    @Post('profile')
    @UseInterceptors(FileInterceptor('file', { storage: storage, limits: limits, fileFilter: fileFilter }))
    @UseGuards(JwtRefreshAuthGuard)
    async uploadProfilePicMedia(@Req() req, @UploadedFile() file: Express.Multer.File) {
        this.logger.log(`Uploading new profile media for user ${req.user.email}, filename ${file.filename}`);
        const user = await this.userService.findOne(req.user?.id);
        if(!user) {
            this.logger.error(`Error: Unable to upload file; cannot find user ${req.user.id}`);
            return false; 
        }
        const upload = await this.uploadService.newUpload(user.id, UploadType.ProfilePic, file);
        const _user = await this.userService.addMedia(user.id, upload.path);
        return { upload: upload, user: _user }; 
    }
    @Post('goal/:id')
    @UseInterceptors(FileInterceptor('file', { storage: storage, limits: limits, fileFilter: fileFilter }))
    @UseGuards(JwtRefreshAuthGuard)
    async uploadGoalPicMedia(@Req() req, @Param('id') id, @UploadedFile() file: Express.Multer.File) {
        this.logger.log(`Uploading new goal media for user ${req.user.email}, filename ${file.filename}`);
        const user = await this.userService.findOne(req.user?.id);
        if(!user) {
            this.logger.error(`Error: Unable to upload file; cannot find user ${req.user.id}`);
            return false; 
        }
        const upload = await this.uploadService.newUpload(user.id, UploadType.Goal, file, id);
        const { goal, progressMarkers } = await this.goalService.findOne(id);
        const _goal = await this.goalService.addMedia(goal.id, upload.path); 
        return { upload: upload, goal: _goal }; 
    }
    @Delete(':id')
    @UseGuards(JwtRefreshAuthGuard)
    async deleteUpload(@Req() req, @Param('id') uploadId: string) {
        this.logger.log(`Deleting media for user ${req.user.email}, upload ${uploadId}`);
        await this.uploadService.rmUpload(req.user.id, uploadId);
        return "Successfully removed upload " + uploadId;  
    }
}