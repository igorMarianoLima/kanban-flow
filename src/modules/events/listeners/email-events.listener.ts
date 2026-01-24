import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailEvent } from '../enums/email-event.enum';
import { EmailService } from 'src/modules/email/email.service';
import { SendEmailDto } from 'src/modules/email/dto/send-email.dto';

@Injectable()
export class EmailEventsListener {
  private readonly logger = new Logger(EmailEventsListener.name);

  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EmailEvent.SEND_EMAIL)
  async handleSendEmailEvent(payload: SendEmailDto) {
    try {
      this.logger.log(`[handleSendEmailEvent] email to: ${payload.to}`);
      await this.emailService.sendEmail(payload);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
