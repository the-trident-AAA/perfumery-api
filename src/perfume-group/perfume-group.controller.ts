import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PerfumeGroupService } from './perfume-group.service';
import { CreatePerfumeGroupDto } from './dto/create-perfume-group.dto';
import { UpdatePerfumeGroupDto } from './dto/update-perfume-group.dto';

@Controller('perfume-group')
export class PerfumeGroupController {
  constructor(private readonly perfumeGroupService: PerfumeGroupService) {}

  @Post()
  create(@Body() createPerfumeGroupDto: CreatePerfumeGroupDto) {
    return this.perfumeGroupService.create(createPerfumeGroupDto);
  }

  @Get()
  findAll() {
    return this.perfumeGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.perfumeGroupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePerfumeGroupDto: UpdatePerfumeGroupDto,
  ) {
    return this.perfumeGroupService.update(+id, updatePerfumeGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perfumeGroupService.remove(+id);
  }
}
