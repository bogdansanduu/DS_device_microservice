import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { AuthGuard } from '../auth/auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import { AssociateDeviceDto } from './dto/associate-device.dto';
import { RolesGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../constants/role';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('createDevice')
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.create(createDeviceDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('getAll')
  findAll() {
    return this.deviceService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceService.findOneById(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get('getByUser/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.deviceService.findAllByUser(+userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.deviceService.update(+id, updateDeviceDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceService.remove(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Patch('associateDevice/:deviceId')
  associateDevice(
    @Param('deviceId') deviceId: string,
    @Body() associateDeviceDto: AssociateDeviceDto,
  ) {
    return this.deviceService.associateDevice(+deviceId, associateDeviceDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get('getTotalConsumptionForUser/:userId/:date')
  getTotalConsumptionForUser(
    @Param('userId') userId: number,
    @Param('date') date: string,
  ) {
    return this.deviceService.getTotalConsumptionForUser(userId, date);
  }

  @MessagePattern({ cmd: 'remove_user_devices' })
  removeUserDevices({ userId }: { userId: number }) {
    return this.deviceService.removeDevicesForUser(userId);
  }

  @MessagePattern({ cmd: 'hourly_consumption' })
  hourlyConsumption({
    deviceId,
    totalConsumption,
  }: {
    deviceId: number;
    totalConsumption: number;
  }) {
    return this.deviceService.hourlyConsumption(deviceId, totalConsumption);
  }

  @MessagePattern({ cmd: 'check_device_exists' })
  async checkDeviceExists({ deviceId }: { deviceId: number }) {
    return !!(await this.deviceService.findOneById(deviceId));
  }
}
