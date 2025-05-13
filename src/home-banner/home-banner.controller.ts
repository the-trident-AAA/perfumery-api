import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HomeBannerService } from './home-banner.service';
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';

@Controller('home-banner')
export class HomeBannerController {
  constructor(private readonly homeBannerService: HomeBannerService) {}

  @Post()
  create(@Body() createHomeBannerDto: CreateHomeBannerDto) {
    return this.homeBannerService.create(createHomeBannerDto);
  }

  @Get()
  findAll() {
    return this.homeBannerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeBannerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHomeBannerDto: UpdateHomeBannerDto,
  ) {
    return this.homeBannerService.update(id, updateHomeBannerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeBannerService.remove(id);
  }
}
