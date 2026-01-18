import { Transporter } from 'nodemailer';
import { EmailAdapterContract } from '../contracts/email-adapter.contract';
import { ConfigService } from 'src/modules/config/config.service';

export class NodemailerServiceAdapter implements EmailAdapterContract {
  constructor(
    private readonly transport: Transporter,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(): Promise<void> {
    const { from } = this.configService.getEmailConfig();

    await this.transport.sendMail({
      from: `"No reply" <${from}>`,
      to: 'test@email.com',
      subject: 'Hello world',
      text: 'Hello world from KanbanFlow',
    });
  }
}
