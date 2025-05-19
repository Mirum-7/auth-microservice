import { AppModule } from '@/app/app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const port = import.meta.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap();
