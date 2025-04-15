import { PartialType } from '@nestjs/mapped-types';
import { CreatePerfumeTypeDto } from './create-perfume-type.dto';

export class UpdatePerfumeTypeDto extends PartialType(CreatePerfumeTypeDto) {}
