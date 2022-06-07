import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaUpload } from '../entities/media-upload.entity';
import { UploadController } from './upload.controller';
import { UploadService } from './upload-file.service';
import { UserModule } from '../user/user.module';
import { GoalsModule } from 'src/goals/goals.module';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MediaUpload]), UserModule, GoalsModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}