import { BuildConfig } from 'bun';
import { join } from 'path';

const paths = {
  entrypoint: join(process.cwd(), 'src', 'app', 'main.ts'),
  output: join(process.cwd(), 'dist'),
};

const config: BuildConfig = {
  entrypoints: [paths.entrypoint],
  target: 'bun',
  outdir: paths.output,
  loader: {
    '.proto': 'file',
  },
  external: [
    'class-validator',
    'class-transformer',
    '@nestjs/websockets/socket-module',
    'nats',
    'mqtt',
    'kafkajs',
    'amqplib',
    'amqp-connection-manager',
    'ioredis',
  ],
  minify: true,
};

export default config;
