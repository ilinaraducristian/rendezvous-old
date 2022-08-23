import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import fastifyCookie from "@fastify/cookie";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  if(process.env.NODE_ENV === 'production')
    app.enableCors({ origin: "http://localhost:3000", credentials: true });
  const configService = app.get(ConfigService);
  await app.register(fastifyCookie, {
    secret: configService.get<string>("COOKIE_SECRET"),
  });
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  await app.listen(process.env.PORT || 3100, '0.0.0.0');
}
bootstrap();
