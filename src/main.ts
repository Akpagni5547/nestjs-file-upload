import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useStaticAssets(path.join(__dirname, '../uploads'));
  // Si tu veux permettre d'avoir tout le dossier upload dispo depuis le public
  await app.listen(3000);
}
bootstrap();
