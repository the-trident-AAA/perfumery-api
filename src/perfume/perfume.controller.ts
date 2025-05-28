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
import { PerfumeService } from './perfume.service';
import { CreatePerfumeDto } from './dto/create-perfume.dto';
import { UpdatePerfumeDto } from './dto/update-perfume.dto';
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PerfumeResponse } from './responses/perfume.response';
import { PerfumeDetailsResponse } from './responses/perfume-details.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidationPipe } from 'src/utils/pipes/image-file-validation.pipe';
import { ApiPaginationdResponse } from 'src/utils/api-responses';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Controller('perfume')
export class PerfumeController {
  constructor(private readonly perfumeService: PerfumeService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Este endpoint agrega un perfume a la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Perfume creado exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de creación de perfume',
  })
  create(
    @Body() dto: CreatePerfumeDto,
    @UploadedFile(new ImageFileValidationPipe()) image: Express.Multer.File,
  ) {
    dto.image = image;
    return this.perfumeService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Este endpoint obtiene una lista de perfumes de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de perfumes obtenidos exitosamente',
    type: ApiPaginationdResponse(
      PerfumeResponse,
      'Representa los perfumes obtenidos como resultado de la de solicitud',
    ),
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener lista de perfumes',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 5, max: 100)',
    example: 5,
  })
  findAll(@Query() paginationDto: PaginationDto) {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.perfumeService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Este endpoint obtiene un perfume en específico de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfume obtenido exitosamente',
    type: PerfumeDetailsResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de obtener el perfume',
  })
  findOne(@Param('id') id: string) {
    return this.perfumeService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Este endpoint edita un perfume de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Perfume editado exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de edición del perfume',
  })
  update(
    @Param('id') id: string,
    @Body() updatePerfumeDto: UpdatePerfumeDto,
    @UploadedFile(new ImageFileValidationPipe()) image: Express.Multer.File,
  ) {
    updatePerfumeDto.image = image;
    return this.perfumeService.update(id, updatePerfumeDto);
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
    return this.perfumeService.remove(id);
  }
}
