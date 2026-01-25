import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AppQueue } from 'src/common/enums/app-queue.enum';
import { SendEmailDto } from 'src/modules/email/dto/send-email.dto';
import { EmailService } from 'src/modules/email/email.service';

@Processor(AppQueue.EMAIL, {
  limiter: {
    max: 1,
    duration: 5000,
  },
})
export class EmailQueueProcessorService extends WorkerHost {
  private readonly logger = new Logger(EmailQueueProcessorService.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<SendEmailDto>) {
    this.logger.log(`Sending email ${job.id} from queue`);
    await this.emailService.sendEmail(job.data);
  }
}
