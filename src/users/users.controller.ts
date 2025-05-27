import { Controller, Post, Body, Delete, Param, Get, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';
import { UserDetailsResponse } from './responses/user-details.response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Este endpoint obtiene una lista de usuarios de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    type: UserResponse,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener lista de usuarios',
  })
  find() {
    return this.usersService.find();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Este endpoint el usuario con el identificador proporcionado',
  })
  @ApiResponse({
    status: 200,
    description:
      'Usuario con el identificador proporcionado con todos sus detalles',
    type: UserDetailsResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener el usuario',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
