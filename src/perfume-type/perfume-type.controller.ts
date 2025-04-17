import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PerfumeTypeService } from './perfume-type.service';
import { CreatePerfumeTypeDto } from './dto/create-perfume-type.dto';
import { UpdatePerfumeTypeDto } from './dto/update-perfume-type.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PerfumeTypeResponse } from './responses/perfume-type.response';

@Controller('perfume-type')
export class PerfumeTypeController {
  constructor(private readonly perfumeTypeService: PerfumeTypeService) {}

  @Post()
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
  create(@Body() createPerfumeTypeDto: CreatePerfumeTypeDto) {
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
  findAll() {
    return this.perfumeTypeService.findAll();
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
    return this.perfumeTypeService.findOne(+id);
  }

  @Patch(':id')
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
  ) {
    return this.perfumeTypeService.update(+id, updatePerfumeTypeDto);
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
    return this.perfumeTypeService.remove(+id);
  }
}
