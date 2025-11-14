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
    buttonText: string,
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
      buttonText,
      isMain,
      image,
      statisticalTips,
      infoTips,
      filters,
    );
  }
}
