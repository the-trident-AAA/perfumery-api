import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScentService } from './scent.service';
import { CreateScentDto } from './dto/create-scent.dto';
import { UpdateScentDto } from './dto/update-scent.dto';

@Controller('scent')
export class ScentController {
  constructor(private readonly scentService: ScentService) {}

  @Post()
  create(@Body() createScentDto: CreateScentDto) {
    return this.scentService.create(createScentDto);
  }

  @Get()
  findAll() {
    return this.scentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScentDto: UpdateScentDto) {
    return this.scentService.update(+id, updateScentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scentService.remove(+id);
  }
}
