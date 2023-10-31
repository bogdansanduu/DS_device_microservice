import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { AssociateDeviceDto } from './dto/associate-device.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
    @Inject('User_MICROSERVICE') private readonly clientDevice: ClientProxy,
  ) {}

  async create({
    address,
    description,
    maxHourlyConsumption,
  }: CreateDeviceDto) {
    const device = await this.deviceRepo.create({
      address,
      description,
      maxHourlyConsumption,
    });

    return await this.deviceRepo.save(device);
  }

  async findAll() {
    return await this.deviceRepo.find();
  }

  async findOneById(id: number) {
    return await this.deviceRepo.findOne({
      where: {
        id,
      },
    });
  }

  async findAllByUser(userId: number) {
    return await this.deviceRepo.find({
      where: {
        userId,
      },
    });
  }

  async update(
    deviceId: number,
    { address, description, maxHourlyConsumption }: UpdateDeviceDto,
  ) {
    const device = await this.findOneById(deviceId);

    if (address) {
      device.address = address;
    }
    if (description) {
      device.description = description;
    }
    if (maxHourlyConsumption) {
      device.maxHourlyConsumption = maxHourlyConsumption;
    }

    return await this.deviceRepo.save(device);
  }

  async remove(deviceId: number) {
    const device = await this.findOneById(deviceId);

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    await this.deviceRepo.remove(device);

    return `Device with ID ${deviceId} has been deleted`;
  }

  async removeDevicesForUser(userId: number) {
    const devices = await this.deviceRepo.findBy({ userId });

    if (!devices || devices.length == 0) {
      throw new NotFoundException(
        `No devices associated to the user with ID ${userId} found`,
      );
    }

    await this.deviceRepo.remove(devices);

    return `Devices associated tot the user with ID ${userId} deleted`;
  }

  async associateDevice(deviceId: number, { userId }: AssociateDeviceDto) {
    const device = await this.findOneById(deviceId);
    const userExists = await firstValueFrom(
      this.clientDevice.send('checkUserExists', {
        userId,
      }),
    );

    if (!device || !userExists) {
      throw new NotFoundException(
        `Device with ID ${deviceId} or User with ID ${userId} not found`,
      );
    }

    device.userId = userId;

    return await this.deviceRepo.save(device);
  }
}
