import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  type FindAll = UsersService['findAll'];
  type FindOne = UsersService['findOne'];
  type Create = UsersService['create'];
  type Update = UsersService['update'];
  type Delete = UsersService['delete'];
  type UsersServiceMock = {
    findAll: jest.MockedFunction<FindAll>;
    findOne: jest.MockedFunction<FindOne>;
    create: jest.MockedFunction<Create>;
    update: jest.MockedFunction<Update>;
    delete: jest.MockedFunction<Delete>;
  };
  let service: UsersServiceMock;

  beforeEach(async () => {
    const serviceMock: UsersServiceMock = {
      findAll: jest.fn<ReturnType<FindAll>, Parameters<FindAll>>(),
      findOne: jest.fn<ReturnType<FindOne>, Parameters<FindOne>>(),
      create: jest.fn<ReturnType<Create>, Parameters<Create>>(),
      update: jest.fn<ReturnType<Update>, Parameters<Update>>(),
      delete: jest.fn<ReturnType<Delete>, Parameters<Delete>>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
    jest.clearAllMocks();
  });

  it('returns all users', async () => {
    const users: Awaited<ReturnType<FindAll>> = [
      {
        id: '1',
        email: 'a@example.com',
        role: UserRole.ADMIN,
        createdAt: new Date(),
      },
    ];
    service.findAll.mockResolvedValue(users);

    await expect(controller.getUsers()).resolves.toEqual(users);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('returns a single user', async () => {
    const user: Awaited<ReturnType<FindOne>> = {
      id: '2',
      email: 'b@example.com',
      role: UserRole.OPERATOR,
      createdAt: new Date(),
    };
    service.findOne.mockResolvedValue(user);

    await expect(controller.getUser('2')).resolves.toEqual(user);
    expect(service.findOne).toHaveBeenCalledWith('2');
  });

  it('creates a user', async () => {
    const dto: CreateUserDto = {
      email: 'c@example.com',
      password: 'password123',
      role: UserRole.VIEWER,
    };

    await expect(controller.createUser(dto)).resolves.toBeUndefined();
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('updates a user', async () => {
    const dto: UpdateUserDto = { email: 'updated@example.com' };

    await expect(controller.updateUser('3', dto)).resolves.toBeUndefined();
    expect(service.update).toHaveBeenCalledWith('3', dto);
  });

  it('deletes a user', async () => {
    service.delete.mockResolvedValue(undefined);

    await expect(controller.deleteUser('4')).resolves.toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith('4');
  });
});
