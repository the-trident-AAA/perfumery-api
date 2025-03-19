import { PartialType } from '@nestjs/swagger';
import { CreatePerfumeDto } from './create-perfume.dto';

export class UpdatePerfumeDto extends PartialType(CreatePerfumeDto) {}
