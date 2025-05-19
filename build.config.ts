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
  external: [
    'class-validator',
    'class-transformer',
    '@nestjs/microservices',
    '@nestjs/websockets/socket-module',
  ],
  minify: true,
};

export default config;
