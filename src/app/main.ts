import { AppModule } from '@/app/app.module';
import { UsersProto } from '@/modules/users';
import { FormattedValidationPipe } from '@/shared/pipes';
import { AppConfigService } from '@/shared/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import cookieParser from 'cookie-parser';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(AppConfigService);
  const port = configService.port;
  const cookieSecret = configService.cookieSecret;

  // Configure cookie parser
  app.use(cookieParser(cookieSecret));

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
