import { Injectable } from '@nestjs/common';
import { EmailAdapterContract } from './contracts/email-adapter.contract';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly adapter: EmailAdapterContract) {}

  sendEmail(payload: SendEmailDto) {
    return this.adapter.sendEmail(payload);
  }
}
