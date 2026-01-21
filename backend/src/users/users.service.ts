import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { userRestSelect } from './users.select';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: userRestSelect,
    });
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        select: userRestSelect,
        where: { id },
      });

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025')
          throw new NotFoundException(`User with id '${id}' not found`);

      throw e;
    }
  }

  async create(dto: CreateUserDto) {
    try {
      const passwordHash = await bcrypt.hash(dto.password, 12);
      await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          role: dto.role,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2002')
          throw new ConflictException(
            `User with email '${dto.email}' already exists`,
          );

      throw e;
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    const data: Prisma.UserUpdateInput = {};

    if (dto.email) data.email = dto.email;

    if (dto.role) data.role = dto.role;

    if (dto.password) data.passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025')
          throw new NotFoundException(`User with id '${id}' not found`);
        if (e.code === 'P2002')
          throw new ConflictException(
            `User with email '${dto.email}' already exists`,
          );
      }

      throw e;
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025')
          throw new NotFoundException(`User with id '${id}' not found`);

      throw e;
    }
  }
}
