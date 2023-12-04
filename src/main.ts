import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const deviceMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: parseInt(process.env.DEVICE_MICROSERVICE_PORT),
    },
  });

  const deviceMicroserviceRabbitMQ =
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'device',
        queueOptions: {
          durable: false,
        },
      },
    });

  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(parseInt(process.env.APP_PORT));
}
bootstrap();
