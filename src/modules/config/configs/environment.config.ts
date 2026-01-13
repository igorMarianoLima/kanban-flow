type Env = 'production' | 'development';

export interface EnvironmentConfig {
  env: Env;
}

export default (): {
  environment: EnvironmentConfig;
} => ({
  environment: {
    env: (process.env.NODE_ENV || 'development') as Env,
  },
});
