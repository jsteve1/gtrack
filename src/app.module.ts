import { Module } from '@nestjs/common';
import { GoalsModule } from './goals/goals.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { User } from './entities/user.entity';
import { SignOnModule } from './signon/signon.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import 'dotenv/config'; 
import { join } from 'path';
@Module({
  imports: [GoalsModule, UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DATABASE_URL}`,
      port: 3306,
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASS}`,
      database: `${process.env.DB_NAME}`,
      entities: [User, Goal],
      synchronize: true,
    }),
    SignOnModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
