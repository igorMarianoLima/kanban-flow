type Env = 'production' | 'development';

export interface EnvironmentConfig {
  env: Env;
  apiUrl: string;
}

export default (): {
  environment: EnvironmentConfig;
} => ({
  environment: {
    env: (process.env.NODE_ENV || 'development') as Env,
    apiUrl: process.env.API_URL || '',
  },
});
