import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import fastifyCookie from "@fastify/cookie";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // app.enableCors({ origin: "http://127.0.0.1:5500", credentials: true });
  const configService = app.get(ConfigService);
  await app.register(fastifyCookie, {
    secret: configService.get<string>("COOKIE_SECRET"),
  });
  await app.listen(3100);
}
bootstrap();
