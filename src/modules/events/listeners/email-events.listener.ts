import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailEvent } from '../enums/email-event.enum';
import { SendEmailDto } from 'src/modules/email/dto/send-email.dto';
import { EmailQueueProducerService } from 'src/queues/email/producer/email-queue-producer.service';

@Injectable()
export class EmailEventsListener {
  private readonly logger = new Logger(EmailEventsListener.name);

  constructor(private readonly emailQueueService: EmailQueueProducerService) {}

  @OnEvent(EmailEvent.SEND_EMAIL)
  async handleSendEmailEvent(payload: SendEmailDto) {
    try {
      await this.emailQueueService.sendEmail(payload);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
