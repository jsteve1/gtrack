import { Module } from '@nestjs/common';
import { GoalsModule } from './goals/goals.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { User } from './entities/user.entity';
import { ProgressMarker } from './entities/progressmarker.entity';
import { SignOnModule } from './signon/signon.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import 'dotenv/config'; 
import { join } from 'path';
import { UploadModule } from './uploads/upload.module';
import { MediaUpload } from './entities/media-upload.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DATABASE_URL}`,
      port: 3306,
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASS}`,
      database: `${process.env.DB_NAME}`,
      entities: [User, Goal, ProgressMarker, MediaUpload],
      synchronize: true,
    }),
    GoalsModule, UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*', '/uploads*'],
    }),
    MulterModule.register({
      dest: './tmp',
    }),
    SignOnModule,
    UploadModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
