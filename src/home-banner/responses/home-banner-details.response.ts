import { PerfumeDetailsResponse } from 'src/perfume/responses/perfume-details.response';
import { HomeBannerResponse } from './home-banner.response';

export class HomeBannerDetailsResponse extends HomeBannerResponse {
  perfumes: PerfumeDetailsResponse[];
  constructor(
    id: string,
    title: string,
    description: string,
    image: string,
    perfumes: PerfumeDetailsResponse[],
  ) {
    super(id, title, description, image);
    this.perfumes = perfumes;
  }
}
