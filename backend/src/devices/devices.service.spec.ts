jest.mock('src/prisma/prisma.service', () => ({ PrismaService: jest.fn() }), {
  virtual: true,
});
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '../../generated/prisma/client';
import type { PrismaService as PrismaServiceType } from '../prisma/prisma.service';
import { PrismaService as PrismaServiceToken } from 'src/prisma/prisma.service';
import { CreateDeviceDto, DeviceStatus } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DevicesService } from './devices.service';

describe('DevicesService', () => {
  let service: DevicesService;
  let prisma: {
    agent: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const createPrismaError = (code: string) =>
    new Prisma.PrismaClientKnownRequestError('error', {
      code,
      clientVersion: '7.2.0',
    });

  beforeEach(async () => {
    prisma = {
      agent: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: PrismaServiceToken,
          useValue: prisma as unknown as PrismaServiceType,
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns all devices', async () => {
      const devices = [
        {
          id: '1',
          name: 'Device 1',
          hostname: 'host1',
          os: 'linux',
          agentToken: 'token1',
          status: DeviceStatus.ONLINE,
          lastSeen: new Date(),
          createdAt: new Date(),
        },
      ];
      prisma.agent.findMany.mockResolvedValue(devices);

      await expect(service.findAll()).resolves.toEqual(devices);
      expect(prisma.agent.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns the requested device', async () => {
      const device = {
        id: '123',
        name: 'Device 123',
        hostname: 'host123',
        os: 'linux',
        agentToken: 'token-123',
        status: DeviceStatus.OFFLINE,
        lastSeen: null,
        createdAt: new Date(),
      };
      prisma.agent.findUnique.mockResolvedValue(device);

      await expect(service.findOne('123')).resolves.toEqual(device);
      expect(prisma.agent.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });

    it('returns null when device is missing', async () => {
      prisma.agent.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).resolves.toBeNull();
    });
  });

  describe('create', () => {
    const dto: CreateDeviceDto = {
      name: 'New Device',
      hostname: 'new-host',
      os: 'linux',
      agentToken: 'new-token',
    };

    it('stores a device', async () => {
      prisma.agent.create.mockResolvedValue(undefined);

      await service.create(dto);

      expect(prisma.agent.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          hostname: dto.hostname,
          os: dto.os,
          agentToken: dto.agentToken,
        },
      });
    });

    it('throws ConflictException when agentToken already exists', async () => {
      prisma.agent.create.mockRejectedValue(createPrismaError('P2002'));

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('updates provided fields', async () => {
      const dto: UpdateDeviceDto = {
        name: 'Updated',
        hostname: 'updated-host',
        os: 'windows',
        agentToken: 'updated-token',
        status: DeviceStatus.ONLINE,
      };
      prisma.agent.update.mockResolvedValue(undefined);

      await service.update('device-id', dto);

      expect(prisma.agent.update).toHaveBeenCalledWith({
        where: { id: 'device-id' },
        data: {
          name: dto.name,
          hostname: dto.hostname,
          os: dto.os,
          agentToken: dto.agentToken,
          status: dto.status,
        },
      });
    });

    it('throws NotFoundException when device is missing', async () => {
      prisma.agent.update.mockRejectedValue(createPrismaError('P2025'));

      await expect(
        service.update('missing', {
          name: 'noop',
          hostname: 'noop-host',
          os: 'linux',
          agentToken: 'noop-token',
          status: DeviceStatus.OFFLINE,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ConflictException when agentToken is duplicated', async () => {
      prisma.agent.update.mockRejectedValue(createPrismaError('P2002'));

      await expect(
        service.update('id', {
          name: 'Device',
          hostname: 'host',
          os: 'linux',
          agentToken: 'dup-token',
          status: DeviceStatus.ONLINE,
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('delete', () => {
    it('deletes the device by id', async () => {
      prisma.agent.delete.mockResolvedValue(undefined);

      await service.delete('to-delete');

      expect(prisma.agent.delete).toHaveBeenCalledWith({
        where: { id: 'to-delete' },
      });
    });

    it('throws NotFoundException when delete misses a record', async () => {
      prisma.agent.delete.mockRejectedValue(createPrismaError('P2025'));

      await expect(service.delete('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
