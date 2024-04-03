import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe()); // To ensure the protection of endpoints to receiving incorrect data.

  /**swagger implimentation */
  const options = new DocumentBuilder()
    .setTitle('IMS')
    .setDescription(
      `Inventory Management System (IMS): 
      The IMS backend is a software component responsible for managing the inventory of products within an organization. It provides APIs for tracking inventory items, processing orders, and generating reports.`,
    )
    .setVersion('1.0')
    .addServer('http://localhost:4000/', 'Local environment')
    .addTag('APIs')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apis', app, document);
  
  await app.listen(4000);
}
bootstrap();
