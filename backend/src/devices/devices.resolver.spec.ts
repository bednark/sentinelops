import { Test, TestingModule } from '@nestjs/testing';
import { DevicesResolver } from './devices.resolver';

describe('DevicesResolver', () => {
  let controller: DevicesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesResolver],
    }).compile();

    controller = module.get<DevicesResolver>(DevicesResolver);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
