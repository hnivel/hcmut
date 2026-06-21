import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OrdersModule } from './orders.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(OrdersModule);

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
    .setTitle('Orders Service')
    .setDescription(
      'Manages order lifecycle: create → confirm → in-progress → complete / cancel. ' +
        'Publishes domain events to Kafka for downstream services.',
    )
    .setVersion('1.0')
    .addTag('orders')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.ORDERS_SERVICE_PORT ?? '3000', 10);
  await app.listen(port);

  console.log(`Orders Service running on http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/docs`);
}

bootstrap();
