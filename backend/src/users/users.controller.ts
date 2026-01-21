import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() dto: CreateUserDto) {
    await this.usersService.create(dto);
  }

  @Patch(':id')
  @HttpCode(204)
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    await this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
