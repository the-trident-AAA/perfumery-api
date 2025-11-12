import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TapeService } from './tape.service';
import { CreateTapeDto } from './dto/create-tape.dto';
import { UpdateTapeDto } from './dto/update-tape.dto';

@Controller('tape')
export class TapeController {
  constructor(private readonly tapeService: TapeService) {}

  @Post()
  create(@Body() createTapeDto: CreateTapeDto) {
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
