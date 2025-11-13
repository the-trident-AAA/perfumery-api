import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { TapeService } from './tape.service';
import { CreateTapeDto } from './dto/create-tape.dto';
import { UpdateTapeDto } from './dto/update-tape.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { Role } from 'src/common/enums/role.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('tape')
export class TapeController {
  constructor(private readonly tapeService: TapeService) {}

  @ApiBearerAuth()
  @Auth([Role.ADMIN])
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @ApiOperation({
    summary: 'Este endpoint agrega un listón a la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Listón creado exitosamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de creación del listón',
  })
  create(
    @Body() createTapeDto: CreateTapeDto,
    @UploadedFiles()
    files: { image: Express.Multer.File[] },
  ) {
    createTapeDto.image = files.image[0];
    return this.tapeService.create(createTapeDto);
  }

  @Get()
  findAll() {
    return this.tapeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tapeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTapeDto: UpdateTapeDto) {
    return this.tapeService.update(+id, updateTapeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tapeService.remove(+id);
  }
}
