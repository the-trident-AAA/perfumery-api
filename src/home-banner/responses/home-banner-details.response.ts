import { HomeBannerResponse, StatisticalTip } from './home-banner.response';

export class HomeBannerDetailsResponse extends HomeBannerResponse {
  constructor(
    id: string,
    title: string,
    description: string,
    isMain: boolean,
    images: string[],
    statisticalTips: StatisticalTip[],
    infoTips: string[],
  ) {
    super(id, title, description, isMain, images, statisticalTips, infoTips);
  }
}
