import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { TapeService } from './tape.service';
import { CreateTapeDto } from './dto/create-tape.dto';
import { UpdateTapeDto } from './dto/update-tape.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { Role } from 'src/common/enums/role.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TapeResponse } from './responses/tape.response';
import { OrderDto } from 'src/utils/dto/order.dto';

@Controller('tape')
export class TapeController {
  constructor(private readonly tapeService: TapeService) {}

  @ApiBearerAuth()
  @Auth([Role.ADMIN])
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'mobileImage', maxCount: 1 },
    ]),
  )
  @ApiOperation({
    summary: 'Este endpoint agrega un listón a la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Listón creado exitosamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de creación del listón',
  })
  create(
    @Body() createTapeDto: CreateTapeDto,
    @UploadedFiles()
    files: { image: Express.Multer.File[]; mobileImage: Express.Multer.File[] },
  ) {
    createTapeDto.image = files.image[0];
    createTapeDto.mobileImage = files.mobileImage[0];
    return this.tapeService.create(createTapeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Este endpoint obtiene una lista de tapes de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tapese obtenida exitosamente',
    type: TapeResponse,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener la lista de tapes',
  })
  findAll(@Query() orderDto: OrderDto) {
    return this.tapeService.findAll(orderDto);
  }

  @Get('find-main-tape')
  @ApiOperation({
    summary: 'Este endpoint obtiene el tape principal',
  })
  @ApiResponse({
    status: 200,
    description: 'Tape principal obtenido exitosamente',
    type: TapeResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener el tape principal',
  })
  findMainTape() {
    return this.tapeService.findMainTape();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Este endpoint obtiene un tape en específico de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Tape obtenida exitosamente',
    type: TapeResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener el tape',
  })
  findOne(@Param('id') id: string) {
    return this.tapeService.findOne(id);
  }

  @ApiBearerAuth()
  @Auth([Role.ADMIN])
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'mobileImage', maxCount: 1 },
    ]),
  )
  @ApiOperation({
    summary: 'Este endpoint edita un tape de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Tape editado exitosamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de edición del tape',
  })
  update(
    @Param('id') id: string,
    @Body() updateTapeDto: UpdateTapeDto,
    @UploadedFiles()
    files: { image: Express.Multer.File[]; mobileImage: Express.Multer.File[] },
  ) {
    updateTapeDto.image = files.image[0];
    updateTapeDto.mobileImage = files.mobileImage[0];
    return this.tapeService.update(id, updateTapeDto);
  }

  @ApiBearerAuth()
  @Auth([Role.ADMIN])
  @Delete(':id')
  @ApiOperation({
    summary: 'Este endpoint elimina un tape de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Tape eliminado exitosamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de eliminación del tape',
  })
  remove(@Param('id') id: string) {
    return this.tapeService.remove(id);
  }

  @ApiBearerAuth()
  @Auth([Role.ADMIN])
  @Post('marked-as-active/:id')
  @ApiOperation({
    summary: 'Este endpoint marca como principal a un tape específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Tape marcado como principal exitosamente',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de marcar como principal el tape',
  })
  markedAsActive(@Param('id') id: string) {
    return this.tapeService.markedAsMainTape(id);
  }
}
