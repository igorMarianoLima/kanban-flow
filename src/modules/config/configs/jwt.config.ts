export interface JwtConfig {
  secret: string;
  issuer: string;
  audience: string;
  expiresIn: number;
}

export default (): { jwt: JwtConfig } => ({
  jwt: {
    secret: process.env.JWT_SECRET || '',
    issuer: process.env.JWT_ISSUER || '',
    audience: process.env.JWT_AUDIENCE || '',
    expiresIn: Number(process.env.JWT_EXPIRES_IN || 3600),
  },
});
