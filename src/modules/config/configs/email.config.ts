export type EmailProvider = 'nodemailer';

export interface EmailConfig {
  provider: EmailProvider;
  host: string;
  port: number;
  ssl: boolean;
  from: string;
  auth: {
    user: string;
    pass: string;
  };
}

export default (): { email: EmailConfig } => ({
  email: {
    provider: (process.env.EMAIL_PROVIDER || 'nodemailer') as EmailProvider,
    host: process.env.EMAIL_HOST || 'localhost',
    port: Number(process.env.EMAIL_PORT || '1025'),
    ssl: process.env.EMAIL_SSL === 'true',
    from: process.env.EMAIL_FROM || 'test@email.com',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  },
});
