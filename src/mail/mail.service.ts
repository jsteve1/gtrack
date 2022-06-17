import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../entities/dto/userDto';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private userService: UserService, private configService: ConfigService) {}

  private readonly logger = new Logger(MailService.name);    

  async sendUserConfirmation(user: CreateUserDto, token: string): Promise<User> {
    this.logger.log(`Creating non-confirmed user and attempting to send confirmation email`);
    const _user = await this.userService.create(user, token);
    const url = `${this.configService.get('APP_DOMAIN')}/api/signon/confirm?token=${token}&email=${_user.email}`;
    await this.mailerService.sendMail({
      to: _user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Goal Tracker! Confirm your Account',
      template: './src/mail/templates/confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: `${_user.fname} ${_user.lname}`,
        url,
      },
    });
    delete _user.pw; 
    delete _user.confirmationToken; 
    delete _user.refreshToken;
    delete _user.resetPwToken;
    return _user; 
  }

  async resetPw(user: User, token: string) {
    this.logger.log(`Sending password reset email for user ${user.email}`);
    const url = `${this.configService.get('APP_DOMAIN')}/api/signon/newpw?token=${token}&email=${user.email}`;
    await this.mailerService.sendMail({
      to: user.email, 
      subject: "Goal Tracker Reset Password",
      template: './src/mail/templates/pwreset',
      context: {
        url
      }
    }); 
  }
}