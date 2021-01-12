import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { GlobalConfig } from '../../config/global.config';
import * as twilio from 'twilio';
import { ConfirmCodeDto } from '../dto/confirm-code.dto';


@Injectable()
export class EmailService {
  async sendWelcomeEmail(to: string) {
    try {
      throw new Error('Building')
    } catch (e) {
      Logger.log(e);
    }
    /*const emailCredentials = this.configService.get<GlobalConfig['nodemailer']>('nodemailer');
    const transporter = nodemailer.createTransport(emailCredentials);
    await transporter.sendMail({
      to,
      from: emailCredentials.auth.user,
      subject: 'Bienvenida',
      html: '<h3> Welcome to Sales Management </h3>',
    });*/
  }

  async sendPhoneCode(data: ConfirmCodeDto) {
    try {
      throw new Error('Building...');
      /*await this.client.messages.create({
        body: 'Codigo de confirmacion Sales Management: ' + data.code,
        from: '+12053908612',
        to: '+' + data.phoneNumber,
      });*/
    } catch (e: unknown) {
      Logger.log(e);
    }
  }
}
