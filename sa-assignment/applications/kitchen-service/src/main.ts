import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { KitchenModule } from './kitchen.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(KitchenModule);

  // Attach Kafka consumer (makes this a hybrid app HTTP + Kafka)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kitchen-service',
        brokers: [(process.env.KAFKA_BROKER ?? 'localhost:9092')],
      },
      consumer: {
        groupId: 'kitchen-service-group',
        allowAutoTopicCreation: true,
      },
    },
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // OpenAPI / Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kitchen Service')
    .setDescription(
      'Kitchen Display System (KDS) API. Tracks kitchen ticket lifecycle: ' +
        'PENDING → IN_PROGRESS → READY. Receives order events from Kafka.',
    )
    .setVersion('1.0')
    .addTag('kitchen')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Start Kafka consumer BEFORE HTTP server
  await app.startAllMicroservices();

  const port = parseInt(process.env.KITCHEN_SERVICE_PORT ?? '3001', 10);
  await app.listen(port);

  console.log(`Kitchen Service running on http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/docs`);
  console.log(`Kafka consumer: listening on topics [orders.created, orders.cancelled]`);
}

bootstrap();
