import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS (So frontend can talk to it)
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  // 2. Connect to HiveMQ Cloud
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: 'mqtts://055b4bf179fd47febadfa84365e1037a.s1.eu.hivemq.cloud:8883', // Note 'mqtts' and port 8883
      username: 'admin',
      password: 'Gayassnigga123',
      subscribeOptions: { qos: 0 },
      socketOptions: {
        rejectUnauthorized: true // Secure connection
      }
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();