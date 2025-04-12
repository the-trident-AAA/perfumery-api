import { Gender } from '../entities/gender.enum';

export class CreatePerfumeDto {
  name: string;
  brandId: number;
  gender: Gender;
  liters: number;
  scentId: number;
  perfumeGroupId: number;
  available: boolean;
  price: number;
  cant: number;
}
