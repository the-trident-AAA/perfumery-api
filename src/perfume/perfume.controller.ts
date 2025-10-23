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
  UploadedFiles,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { PerfumeService } from './perfume.service';
import { CreatePerfumeDto } from './dto/create-perfume.dto';
import { UpdatePerfumeDto } from './dto/update-perfume.dto';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PerfumeResponse } from './responses/perfume.response';
import { PerfumeDetailsResponse } from './responses/perfume-details.response';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ImageFileValidationPipe } from 'src/utils/pipes/image-file-validation.pipe';
import { ApiPaginationdResponse } from 'src/utils/api-responses';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { FiltersPerfumeDto } from './dto/filters-perfume.dto';
import { OrderDto } from 'src/utils/dto/order.dto';
import { ImagesFileValidationPipe } from 'src/utils/pipes/images-file-validation.pipe';

@Controller('perfume')
export class PerfumeController {
  constructor(private readonly perfumeService: PerfumeService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  @ApiOperation({
    summary: 'Este endpoint agrega un perfume a la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Perfume creado exitosamente' })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de creación de perfume',
  })
  async create(
    @Body() dto: CreatePerfumeDto,
    @UploadedFiles()
    files: { image: Express.Multer.File[]; images?: Express.Multer.File[] },
  ) {
    dto.image = files.image[0];
    dto.images = files.images;
    return this.perfumeService.create(dto);
  }

  @Get('best-sellers')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary:
      'Este endpoint obtiene una lista de perfumes más vendidos la base de datos',
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
  getBestSellers(@Query('limit') limit?: string) {
    return this.perfumeService.getBestSellers(
      limit ? Number(limit) : undefined,
    );
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
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
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filtersPerfumeDto: FiltersPerfumeDto,
    @Query() orderDto: OrderDto,
  ) {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.perfumeService.findAll(
      paginationDto,
      filtersPerfumeDto,
      orderDto,
    );
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
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
    @UploadedFiles()
    files: { image: Express.Multer.File[]; images?: Express.Multer.File[] },
  ) {
    updatePerfumeDto.image = files.image[0];
    updatePerfumeDto.images = files.images;
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
