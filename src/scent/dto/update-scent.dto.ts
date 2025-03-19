import { PartialType } from '@nestjs/swagger';
import { CreateScentDto } from './create-scent.dto';

export class UpdateScentDto extends PartialType(CreateScentDto) {}
