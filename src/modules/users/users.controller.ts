import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('current', new DefaultValuePipe(1), ParseIntPipe)
    current: number,

    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number,
  ) {

    return this.usersService.findAll({}, current, pageSize);
  }

  @Get(':id')
  async findOne(@Param('id') userId: string) {
    return await this.usersService.findOne(userId);
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto) {

    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

    return this.usersService.remove(id);
  }
}
