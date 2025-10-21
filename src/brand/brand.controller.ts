import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BrandResponse } from './responses/brand.response';
import { FiltersBrandDto } from './dto/filters-brand.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { ApiPaginationdResponse } from 'src/utils/api-responses';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiOperation({
    summary: 'Este endpoint agrega una marca a la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Marca creada exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de creación de la marca',
  })
  create(@Body() dto: CreateBrandDto) {
    return this.brandService.create(dto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Este endpoint obtiene una lista de marcas de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de marcas obtenida exitosamente',
    type: BrandResponse,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener la lista de marcas',
  })
  findAll(@Query() filtersBrandDto: FiltersBrandDto) {
    return this.brandService.findAll(filtersBrandDto);
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Este endpoint obtiene una marca en específico de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Marca obtenida exitosamente',
    type: BrandResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener la marca',
  })
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Este endpoint edita una marca de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Marca editada exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de edición de la marca',
  })
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Este endpoint elimina una marca de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Marca editada exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de edición de la marca',
  })
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
