import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PerfumeService } from './perfume.service';
import { CreatePerfumeDto } from './dto/create-perfume.dto';
import { UpdatePerfumeDto } from './dto/update-perfume.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PerfumeResponse } from './responses/perfume.response';

@Controller('perfume')
export class PerfumeController {
  constructor(private readonly perfumeService: PerfumeService) {}

  @Post()
  @ApiOperation({
    summary: 'Este endpoint agrega un perfume a la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Perfume creado exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de creación de perfume',
  })
  create(@Body() createPerfumeDto: CreatePerfumeDto) {
    return this.perfumeService.create(createPerfumeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Este endpoint obtiene una lista de perfumes de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de perfumes obtenidos exitosamente',
    type: PerfumeResponse,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener lista de perfumes',
  })
  findAll() {
    return this.perfumeService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Este endpoint obtiene un perfume en específico de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfume obtenido exitosamente',
    type: PerfumeResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener el perfume',
  })
  findOne(@Param('id') id: string) {
    return this.perfumeService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Este endpoint edita un perfume de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Perfume editado exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de edición del perfume',
  })
  update(@Param('id') id: string, @Body() updatePerfumeDto: UpdatePerfumeDto) {
    return this.perfumeService.update(+id, updatePerfumeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Este endpoint elimina un perfume de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Perfume eliminado exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de eliminación del perfume',
  })
  remove(@Param('id') id: string) {
    return this.perfumeService.remove(+id);
  }
}
