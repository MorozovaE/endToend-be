import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';
import { join, resolve } from 'path';

export const MAIL_TEMPLATE_PATH = join(process.cwd(), 'templates/');

export const getFullTemplatePath = (templatePath: string): string => {
  return resolve(MAIL_TEMPLATE_PATH, ...templatePath.split('/'));
};

@Injectable()
export class MailingService {
  constructor(private readonly mailerService: MailerService) {}

  async generateEmailToken() {
    const token = await crypto.lib.WordArray.random(128 / 8).toString();
    return token;
  }

  async sendEmailConfirm(email: string, name: string, feedbackToken: string) {
    const res = await this.mailerService.sendMail({
      to: email,
      subject: 'Email confirm',
      template: getFullTemplatePath('users/confirm-email'),
      context: {
        name: name,
        confirm_link:
          'http://localhost:3000/verify?token=' + feedbackToken,
      },
    });
  }
}
