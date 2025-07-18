import { AppModule } from '@/app/app.module';
import { UsersProto } from '@/modules/users';
import { FormattedValidationPipe } from '@/shared/pipes';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = import.meta.env.PORT ?? 3000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure cookie parser
  app.use(cookieParser(process.env.COOKIE_SECRET || 'default-cookie-secret'));

  app.useGlobalPipes(new FormattedValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: resolve(UsersProto),
      url: `0.0.0.0:4000`,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
