import { PerfumeDetailsResponse } from 'src/perfume/responses/perfume-details.response';

export class ShopCartPerfumeResponse {
  id: string;
  perfume: PerfumeDetailsResponse;
  cant: number;

  constructor(id: string, perfume: PerfumeDetailsResponse, cant: number) {
    this.id = id;
    this.perfume = perfume;
    this.cant = cant;
  }
}
