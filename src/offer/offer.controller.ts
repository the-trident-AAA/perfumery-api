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
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OfferResponse } from './responses/offer.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidationPipe } from 'src/utils/pipes/image-file-validation.pipe';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Este endpoint agrega una oferta a la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Oferta creada exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de creación de la oferta',
  })
  create(
    @Body() createOfferDto: CreateOfferDto,
    @UploadedFile(new ImageFileValidationPipe()) image: Express.Multer.File,
  ) {
    createOfferDto.image = image;
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
    return this.offerService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Este endpoint edita una oferta de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Oferta editada exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de edición de la oferta',
  })
  update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
    @UploadedFile(new ImageFileValidationPipe()) image: Express.Multer.File,
  ) {
    updateOfferDto.image = image;
    return this.offerService.update(id, updateOfferDto);
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
    return this.offerService.remove(id);
  }
}
