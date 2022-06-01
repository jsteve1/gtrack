import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoalsModule } from './goals/goals.module';
import { UserModule } from './user/user.module';
import { Goals } from './goals';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config'; 
import { Goal } from './entities/goal.entity';
import { User } from './entities/user.entity';
console.log(`${process.env.DATABASE_URL}`, `${process.env.DB_USER}`,`${process.env.DB_PASS}`)
@Module({
  imports: [GoalsModule, UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DATABASE_URL}`,
      port: 3306,
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASS}`,
      database: `${process.env.DB_NAME}`,
      entities: [User, Goal],
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService, Goals, User],
})
export class AppModule {}
