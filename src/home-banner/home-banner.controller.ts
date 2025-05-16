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
import { HomeBannerService } from './home-banner.service';
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HomeBannerResponse } from './responses/home-banner.response';
import { HomeBannerDetailsResponse } from './responses/home-banner-details.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidationPipe } from 'src/utils/pipes/image-file-validation.pipe';

@Controller('home-banner')
export class HomeBannerController {
  constructor(private readonly homeBannerService: HomeBannerService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Este endpoint agrega un banner del home a la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Banner del Home creado exitosamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de creación de la oferta',
  })
  create(
    @Body() createHomeBannerDto: CreateHomeBannerDto,
    @UploadedFile(new ImageFileValidationPipe()) image: Express.Multer.File,
  ) {
    createHomeBannerDto.image = image;
    return this.homeBannerService.create(createHomeBannerDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Este endpoint obtiene una lista de banners del home de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de banners del home obtenida exitosamente',
    type: HomeBannerResponse,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de obtener la lista de banners del home',
  })
  findAll() {
    return this.homeBannerService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Este endpoint obtiene un banner del home en específico de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Banner del Home obtenida exitosamente',
    type: HomeBannerDetailsResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener el banner del home',
  })
  findOne(@Param('id') id: string) {
    return this.homeBannerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Este endpoint edita un banner del home de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Banner del home editado exitosamente',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de edición del banner del home',
  })
  update(
    @Param('id') id: string,
    @Body() updateHomeBannerDto: UpdateHomeBannerDto,
  ) {
    return this.homeBannerService.update(id, updateHomeBannerDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Este endpoint elimina un banner del home de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Banner del home eliminado exitosamente',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de eliminación del banner del home',
  })
  remove(@Param('id') id: string) {
    return this.homeBannerService.remove(id);
  }
}
