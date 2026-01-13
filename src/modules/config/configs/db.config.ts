export interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export default (): {
  db: DbConfig;
} => ({
  db: {
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT || 0),
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_SCHEMA || '',
  },
});
