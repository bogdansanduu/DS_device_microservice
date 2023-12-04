import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    ClientsModule.register([
      {
        name: 'User_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          port: parseInt(process.env.USER_MICROSERVICE_PORT),
        },
      },
      {
        name: 'Monitoring_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          port: parseInt(
            process.env.MONITORING_COMMUNICATION_MICROSERVICE_PORT,
          ),
        },
      },
    ]),
    NotificationsModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
