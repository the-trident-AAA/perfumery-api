import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ScentService } from './scent.service';
import { CreateScentDto } from './dto/create-scent.dto';
import { UpdateScentDto } from './dto/update-scent.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScentResponse } from './responses/scent.response';
import { FiltersScentDto } from './dto/filters-scent.dto';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { Role } from 'src/common/enums/role.enum';
import { OrderDto } from 'src/utils/dto/order.dto';

@Controller('scent')
export class ScentController {
  constructor(private readonly scentService: ScentService) {}

  @ApiBearerAuth()
  @Auth([Role.ADMIN])
  @Post()
  @ApiOperation({
    summary: 'Este endpoint agrega un aroma a la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Aroma creado exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de creación del aroma',
  })
  create(@Body() createScentDto: CreateScentDto) {
    return this.scentService.create(createScentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Este endpoint obtiene una lista de aromas de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de aromas obtenida exitosamente',
    type: ScentResponse,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener la lista de aromas',
  })
  findAll(
    @Query() filtersScentDto: FiltersScentDto,
    @Query() orderDto: OrderDto,
  ) {
    return this.scentService.findAll(filtersScentDto, orderDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Este endpoint obtiene un aroma en específico de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Aroma obtenido exitosamente',
    type: ScentResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener el aroma',
  })
  findOne(@Param('id') id: string) {
    return this.scentService.findOne(id);
  }

  @ApiBearerAuth()
  @Auth([Role.ADMIN])
  @Patch(':id')
  @ApiOperation({
    summary: 'Este endpoint edita un aroma de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Aroma editado exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de edición del aroma',
  })
  update(@Param('id') id: string, @Body() updateScentDto: UpdateScentDto) {
    return this.scentService.update(id, updateScentDto);
  }

  @ApiBearerAuth()
  @Auth([Role.ADMIN])
  @Delete(':id')
  @ApiOperation({
    summary: 'Este endpoint elimina un aroma de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Aroma eliminado exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de eliminación del aroma',
  })
  remove(@Param('id') id: string) {
    return this.scentService.remove(id);
  }
}
