import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ResponseInterceptor } from './library/interceptors/response.interceptor';

async function bootstrap() {
  const adapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(MainModule, adapter);
  app.enableCors({ origin: true });
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen({ host: '0.0.0.0', port: parseInt((process.env.PORT as string) ?? 3000) });
}

void bootstrap();
