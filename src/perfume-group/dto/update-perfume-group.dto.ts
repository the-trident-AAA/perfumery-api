import { PartialType } from '@nestjs/mapped-types';
import { CreatePerfumeGroupDto } from './create-perfume-group.dto';

export class UpdatePerfumeGroupDto extends PartialType(CreatePerfumeGroupDto) {}
