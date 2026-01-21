import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userRestSelect } from './users.select';
import { UsersService } from './users.service';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findMany: jest.Mock;
      findUniqueOrThrow: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };
  type HashFunction = (
    data: string | Buffer,
    saltOrRounds: string | number,
  ) => Promise<string>;
  const hashMock = bcrypt.hash as unknown as jest.MockedFunction<HashFunction>;

  const createPrismaError = (code: string) =>
    new Prisma.PrismaClientKnownRequestError('error', {
      code,
      clientVersion: '7.2.0',
    });

  beforeEach(async () => {
    prisma = {
      user: {
        findMany: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns all users using the public select shape', async () => {
      const users = [
        {
          id: '1',
          email: 'one@example.com',
          role: UserRole.ADMIN,
          createdAt: new Date(),
        },
      ];
      prisma.user.findMany.mockResolvedValue(users);

      await expect(service.findAll()).resolves.toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: userRestSelect,
      });
    });
  });

  describe('findOne', () => {
    it('returns the requested user', async () => {
      const user = {
        id: '123',
        email: 'a@example.com',
        role: UserRole.VIEWER,
        createdAt: new Date(),
      };
      prisma.user.findUniqueOrThrow.mockResolvedValue(user);

      await expect(service.findOne('123')).resolves.toEqual(user);
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        select: userRestSelect,
        where: { id: '123' },
      });
    });

    it('throws NotFoundException when user is missing', async () => {
      prisma.user.findUniqueOrThrow.mockRejectedValue(
        createPrismaError('P2025'),
      );

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const dto: CreateUserDto = {
      email: 'new@example.com',
      password: 'password123',
      role: UserRole.OPERATOR,
    };

    it('hashes the password and stores a user', async () => {
      hashMock.mockResolvedValue('hashed-password');
      prisma.user.create.mockResolvedValue(undefined);

      await service.create(dto);

      expect(hashMock).toHaveBeenCalledWith(dto.password, 12);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          passwordHash: 'hashed-password',
          role: dto.role,
        },
      });
    });

    it('throws ConflictException when email already exists', async () => {
      hashMock.mockResolvedValue('hashed-password');
      prisma.user.create.mockRejectedValue(createPrismaError('P2002'));

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('updates provided fields and hashes the password when present', async () => {
      const dto: UpdateUserDto = {
        email: 'updated@example.com',
        password: 'new-password',
        role: UserRole.VIEWER,
      };
      hashMock.mockResolvedValue('updated-hash');
      prisma.user.update.mockResolvedValue(undefined);

      await service.update('user-id', dto);

      expect(hashMock).toHaveBeenCalledWith('new-password', 12);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: {
          email: 'updated@example.com',
          passwordHash: 'updated-hash',
          role: UserRole.VIEWER,
        },
      });
    });

    it('throws NotFoundException when user is missing', async () => {
      prisma.user.update.mockRejectedValue(createPrismaError('P2025'));

      await expect(
        service.update('missing', { email: 'noop@example.com' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deletes the user by id', async () => {
      prisma.user.delete.mockResolvedValue(undefined);

      await service.delete('to-delete');

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'to-delete' },
      });
    });

    it('throws NotFoundException when delete misses a record', async () => {
      prisma.user.delete.mockRejectedValue(createPrismaError('P2025'));

      await expect(service.delete('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
