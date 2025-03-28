import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './config/logger';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import * as mongoSanitize from 'express-mongo-sanitize';
import * as bodyParser from 'body-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuracion de Swagger
  const config = new DocumentBuilder()
    .setTitle('API alfabeto Coreano - Hangul')
    .setDescription(
      'Documentación del API para el manejo de caracteres del alfabeto Coreano',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // midleware para logear todas las peticiones
  app.use((req, res, next) => {
    logger.info(`Request: ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
  });

  app.useWebSocketAdapter(new IoAdapter(app)); // Habilita WebSockets

  // activación de CORS
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuración de límite de llamadas al API
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 100,
      message: 'Demasiados intentos',
    }),
  );

  // Proteccion contra ataques comunes como XSS, Clickjacking y Sniffing.
  app.use(helmet());

  // Evita que un atacante realice acciones en nombre de un usuario autenticado.
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  // app.use(
  //   csurf({
  //     cookie: false, // No usar cookies si manejas CSRF en el body
  //   }),
  // );

  // Evita ataques donde un usuario envía consultas maliciosas ({"$gt": ""}) para acceder a datos no autorizados.
  // app.use(mongoSanitize());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
