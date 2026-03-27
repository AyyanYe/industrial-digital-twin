import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Connect to MQTT Broker
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: 'mqtts://055b4bf179fd47febadfa84365e1037a.s1.eu.hivemq.cloud:8883',
      username: 'admin',
      password: 'Gayassnigga123',
    },
  });

  app.enableCors(); // Allow Frontend to connect later
  await app.startAllMicroservices();
  await app.listen(3001);
  console.log('Hybrid Gateway running on Port 3001 & MQTT 1883');
}
bootstrap();