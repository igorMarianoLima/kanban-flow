import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailAdapterContract } from './contracts/email-adapter.contract';
import { ConfigService } from '../config/config.service';
import { NodemailerServiceAdapter } from './adapters/nodemailer-service.adapter';
import { createTransport } from 'nodemailer';

@Module({
  providers: [
    EmailService,
    {
      provide: EmailAdapterContract,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.getEmailConfig();

        if (config.provider === 'nodemailer') {
          const transport = createTransport({
            host: config.host,
            port: config.port,
            secure: config.ssl,
            ...(config.auth.user && {
              auth: {
                user: config.auth.user,
                pass: config.auth.pass,
              },
            }),
          });

          return new NodemailerServiceAdapter(transport, configService);
        }
      },
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
