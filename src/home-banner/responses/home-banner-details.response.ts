import { HomeBannerResponse } from './home-banner.response';

export class HomeBannerDetailsResponse extends HomeBannerResponse {
  constructor(id: string, title: string, description: string, image: string) {
    super(id, title, description, image);
  }
}
