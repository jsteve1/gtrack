import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SignOnService } from './signon.service';
import { SignOnStrategy } from '../guards/strategies/signon.strategy';
import { JwtRefreshStrategy } from '../guards/strategies/jwt-refresh.strategy';
import { UserModule } from '../user/user.module';
import { SignonController } from './signon.controller';


@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.REFRESH_SECRET,
      signOptions: { expiresIn: '900s' },
    }),
  ],
  controllers: [SignonController],
  providers: [SignOnService, SignOnStrategy, JwtRefreshStrategy],
  exports: [SignOnService],
})
export class SignOnModule {}