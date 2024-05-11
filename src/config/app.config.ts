import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  const port = parseInt(process.env.APP_PORT || process.env.PORT || '3000', 10);
  return {
    port,
    apiPrefix: process.env.API_PREFIX || 'api',
  };
});
