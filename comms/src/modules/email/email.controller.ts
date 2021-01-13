import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EmailService } from './email.service';
import {ConfirmCodeDto} from "../dto/confirm-code.dto";

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('NEW_USER')
  sendEmail(email: string) {
    this.emailService.sendWelcomeEmail(email);
  }

  @EventPattern('CONFIRMATION_CODE')
  confirmPhone(data: ConfirmCodeDto) {
    this.emailService.sendPhoneCode(data);
  }
}
