import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import  tracer from './tracer1';
import sdk from './tracing';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //////////// Swagger Configuration ////////
  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME)
    .setDescription('The API description')
    .setVersion(process.env.APP_VERSION)
    // .addTag('Service')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
//////////////// End Swagger ////////////////

app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    validationError: {
      target: false,
      value: false,
    },
  }),
);

  // console.log(tracer());
 await sdk.start();
 //console.log(tracer.start());

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
