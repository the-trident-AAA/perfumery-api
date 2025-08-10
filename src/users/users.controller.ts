import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';
import { UserDetailsResponse } from './responses/user-details.response';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { Role } from 'src/common/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidationPipe } from 'src/utils/pipes/image-file-validation.pipe';

@ApiBearerAuth()
@Auth([Role.USER])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
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

  @Get('find-one-without-relations/:id')
  @UseInterceptors(ClassSerializerInterceptor)
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
  findOneWithoutRelations(@Param('id') id: string) {
    return this.usersService.findOneWithOutRelations(id);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
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

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({
    summary:
      'Endpoint para actualizar la información de pérfil de un usuario en específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario actualizados',
    type: UserDetailsResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de actualizar el usuario',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile(new ImageFileValidationPipe()) avatar: Express.Multer.File,
  ) {
    dto.avatar = avatar;
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
