import { PartialType } from '@nestjs/swagger';
import { CreateTapeDto } from './create-tape.dto';

export class UpdateTapeDto extends PartialType(CreateTapeDto) {}
