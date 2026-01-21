jest.mock('src/prisma/prisma.service', () => ({ PrismaService: jest.fn() }), {
  virtual: true,
});
import { Test, TestingModule } from '@nestjs/testing';
import { CreateDeviceDto, DeviceStatus } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

describe('DevicesController', () => {
  let controller: DevicesController;
  type FindAll = DevicesService['findAll'];
  type FindOne = DevicesService['findOne'];
  type Create = DevicesService['create'];
  type Update = DevicesService['update'];
  type Delete = DevicesService['delete'];
  type DevicesServiceMock = {
    findAll: jest.MockedFunction<FindAll>;
    findOne: jest.MockedFunction<FindOne>;
    create: jest.MockedFunction<Create>;
    update: jest.MockedFunction<Update>;
    delete: jest.MockedFunction<Delete>;
  };
  let service: DevicesServiceMock;

  beforeEach(async () => {
    const serviceMock: DevicesServiceMock = {
      findAll: jest.fn<ReturnType<FindAll>, Parameters<FindAll>>(),
      findOne: jest.fn<ReturnType<FindOne>, Parameters<FindOne>>(),
      create: jest.fn<ReturnType<Create>, Parameters<Create>>(),
      update: jest.fn<ReturnType<Update>, Parameters<Update>>(),
      delete: jest.fn<ReturnType<Delete>, Parameters<Delete>>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [{ provide: DevicesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<DevicesController>(DevicesController);
    service = module.get(DevicesService);
    jest.clearAllMocks();
  });

  it('returns all devices', async () => {
    const devices: Awaited<ReturnType<FindAll>> = [
      {
        id: '1',
        name: 'Device 1',
        hostname: 'host1',
        os: 'linux',
        agentToken: 'token1',
        status: 'ONLINE',
        lastSeen: null,
        createdAt: new Date(),
      },
    ];
    service.findAll.mockResolvedValue(devices);

    await expect(controller.getDevices()).resolves.toEqual(devices);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('returns a single device', async () => {
    const device: Awaited<ReturnType<FindOne>> = {
      id: '2',
      name: 'Device 2',
      hostname: 'host2',
      os: 'linux',
      agentToken: 'token2',
      status: 'OFFLINE',
      lastSeen: new Date(),
      createdAt: new Date(),
    };
    service.findOne.mockResolvedValue(device);

    await expect(controller.getDevice('2')).resolves.toEqual(device);
    expect(service.findOne).toHaveBeenCalledWith('2');
  });

  it('creates a device', async () => {
    const dto: CreateDeviceDto = {
      name: 'Device 3',
      hostname: 'host3',
      os: 'linux',
      agentToken: 'token3',
    };

    await expect(controller.createDevice(dto)).resolves.toBeUndefined();
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('updates a device', async () => {
    const dto: UpdateDeviceDto = {
      name: 'Updated Device',
      hostname: 'updated-host',
      os: 'linux',
      agentToken: 'token-3',
      status: DeviceStatus.ONLINE,
    };

    await expect(controller.updateDevice('3', dto)).resolves.toBeUndefined();
    expect(service.update).toHaveBeenCalledWith('3', dto);
  });

  it('deletes a device', async () => {
    service.delete.mockResolvedValue(undefined);

    await expect(controller.deleteDevice('4')).resolves.toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith('4');
  });
});
