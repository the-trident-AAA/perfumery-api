import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OfferResponse } from './responses/offer.response';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @ApiOperation({
    summary: 'Este endpoint agrega una oferta a la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Oferta creada exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de creación de la oferta',
  })
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offerService.create(createOfferDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Este endpoint obtiene una lista de ofertas de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ofertas obtenida exitosamente',
    type: OfferResponse,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de obtener la lista de ofertas',
  })
  findAll() {
    return this.offerService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Este endpoint obtiene una oferta en específico de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Oferta obtenida exitosamente',
    type: OfferResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener la oferta',
  })
  findOne(@Param('id') id: string) {
    return this.offerService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Este endpoint edita una oferta de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Oferta editada exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de edición de la oferta',
  })
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offerService.update(+id, updateOfferDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Este endpoint elimina una oferta de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Oferta editada exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de edición de la oferta',
  })
  remove(@Param('id') id: string) {
    return this.offerService.remove(+id);
  }
}
