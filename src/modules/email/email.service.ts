import { Injectable } from '@nestjs/common';
import { EmailAdapterContract } from './contracts/email-adapter.contract';

@Injectable()
export class EmailService {
  constructor(private readonly adapter: EmailAdapterContract) {}

  sendEmail() {
    return this.adapter.sendEmail();
  }
}
