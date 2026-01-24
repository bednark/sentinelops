import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.device.findMany();
  }

  async findOne(id: string) {
    try {
      return await this.prisma.device.findUnique({
        where: { id },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          return null;
        }
      }

      throw new InternalServerErrorException(
        `Failed to fetch device ${id}`,
      );
    }
  }

  async create(dto: CreateDeviceDto) {
    try {
      await this.prisma.device.create({
        data: {
          name: dto.name,
          hostname: dto.hostname,
          os: dto.os,
          agentToken: dto.agentToken,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2002')
          throw new ConflictException(
            `Device with agentToken '${dto.agentToken}' already exists`,
          );

      throw e;
    }
  }

  async update(id: string, dto: UpdateDeviceDto) {
    const data: Prisma.DeviceUpdateInput = {};

    if (dto.name) data.name = dto.name;

    if (dto.hostname) data.hostname = dto.hostname;

    if (dto.os) data.os = dto.os;

    if (dto.agentToken) data.agentToken = dto.agentToken;

    if (dto.status) data.status = dto.status;

    try {
      await this.prisma.device.update({
        where: { id },
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025')
          throw new NotFoundException(`Device with id '${id}' not found`);
        if (e.code === 'P2002')
          throw new ConflictException(
            `Device with agentToken '${dto.agentToken}' already exists`,
          );
      }
      throw e;
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.device.delete({
        where: { id },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025')
          throw new NotFoundException(`Device with id '${id}' not found`);

      throw e;
    }
  }
}
