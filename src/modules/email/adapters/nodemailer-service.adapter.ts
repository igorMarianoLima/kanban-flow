import { Transporter } from 'nodemailer';
import { EmailAdapterContract } from '../contracts/email-adapter.contract';
import { ConfigService } from 'src/modules/config/config.service';
import { SendEmailDto } from '../dto/send-email.dto';

export class NodemailerServiceAdapter implements EmailAdapterContract {
  constructor(
    private readonly transport: Transporter,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(payload: SendEmailDto): Promise<void> {
    const { from } = this.configService.getEmailConfig();

    await this.transport.sendMail({
      from: `"No reply" <${from}>`,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    });
  }
}
