import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Delete()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete()
  removeAll() {
    return this.usersService.removeAll();
  }
}
