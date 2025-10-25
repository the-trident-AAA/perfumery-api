import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { PerfumeTypeService } from './perfume-type.service';
import { CreatePerfumeTypeDto } from './dto/create-perfume-type.dto';
import { UpdatePerfumeTypeDto } from './dto/update-perfume-type.dto';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PerfumeTypeResponse } from './responses/perfume-type.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidationPipe } from 'src/utils/pipes/image-file-validation.pipe';
import { FiltersPerfumeTypeDto } from './dto/filters-perfume-type.dto';

@Controller('perfume-type')
export class PerfumeTypeController {
  constructor(private readonly perfumeTypeService: PerfumeTypeService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Este endpoint agrega un tipo de perfume a la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de perfume creado exitosamente',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de creación de tipo de perfume',
  })
  create(
    @Body() createPerfumeTypeDto: CreatePerfumeTypeDto,
    @UploadedFile(new ImageFileValidationPipe()) image: Express.Multer.File,
  ) {
    createPerfumeTypeDto.image = image;
    return this.perfumeTypeService.create(createPerfumeTypeDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Este endpoint obtiene una lista de tipo de perfumes de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipo de perfumes obtenida exitosamente',
    type: PerfumeTypeResponse,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de obtener la lista de tipo de perfumes',
  })
  findAll(@Query() filtersPerfumeTypeDto: FiltersPerfumeTypeDto) {
    return this.perfumeTypeService.findAll(filtersPerfumeTypeDto);
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Este endpoint obtiene un tipo de perfume en específico de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de perfume obtenido exitosamente',
    type: PerfumeTypeResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener el tipo de perfume',
  })
  findOne(@Param('id') id: string) {
    return this.perfumeTypeService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Este endpoint edita un tipo de perfume de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de perfume editado exitosamente',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de edición del tipo de perfume',
  })
  update(
    @Param('id') id: string,
    @Body() updatePerfumeTypeDto: UpdatePerfumeTypeDto,
    @UploadedFile(new ImageFileValidationPipe()) image: Express.Multer.File,
  ) {
    updatePerfumeTypeDto.image = image;
    return this.perfumeTypeService.update(id, updatePerfumeTypeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Este endpoint elimina un tipo de perfume de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de perfume eliminado exitosamente',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de eliminación del tipo de perfume',
  })
  remove(@Param('id') id: string) {
    return this.perfumeTypeService.remove(id);
  }
}
