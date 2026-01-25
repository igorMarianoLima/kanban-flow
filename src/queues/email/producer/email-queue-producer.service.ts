import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { AppQueue } from 'src/common/enums/app-queue.enum';
import { SendEmailDto } from 'src/modules/email/dto/send-email.dto';

@Injectable()
export class EmailQueueProducerService {
  constructor(
    @InjectQueue(AppQueue.EMAIL)
    private readonly queue: Queue,
  ) {}

  async sendEmail(email: SendEmailDto) {
    const job = await this.queue.add('send-test', email, {
      attempts: 3,
      backoff: 5000,
      delay: 1000,
    });

    return job.id;
  }
}
