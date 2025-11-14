import {
  HomeBannerFilter,
  HomeBannerResponse,
  StatisticalTip,
} from './home-banner.response';

export class HomeBannerDetailsResponse extends HomeBannerResponse {
  constructor(
    id: string,
    title: string,
    description: string,
    isMain: boolean,
    image: string,
    statisticalTips: StatisticalTip[],
    infoTips: string[],
    filters: HomeBannerFilter[],
  ) {
    super(
      id,
      title,
      description,
      isMain,
      image,
      statisticalTips,
      infoTips,
      filters,
    );
  }
}
