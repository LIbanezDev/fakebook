import { TcpOptions, Transport } from '@nestjs/microservices';

interface GlobalConfig {
  port: string | number;
  redisUri: string;
  authService: { transport: Transport.TCP } & TcpOptions;
  marketService: { transport: Transport.TCP } & TcpOptions;
  usersService: { transport: Transport.TCP } & TcpOptions;
  gcpCredentials: object
}

export const globalConfig = (): GlobalConfig => ({
  port: process.env.PORT,
  redisUri: process.env.REDIS_URI,
  authService: {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_SV_HOST,
      port: parseInt(process.env.AUTH_SV_PORT),
    },
  },
  marketService: {
    transport: Transport.TCP,
    options: {
      host: process.env.MARKET_SV_HOST,
      port: parseInt(process.env.MARKET_SV_PORT),
    },
  },
  usersService: {
    transport: Transport.TCP,
    options: {
      host: process.env.USERS_SV_HOST,
      port: parseInt(process.env.USERS_SV_PORT),
    },
  },
  gcpCredentials: JSON.parse(process.env.GCP_CREDS) || {},
});
