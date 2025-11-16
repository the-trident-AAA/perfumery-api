import { TextColor } from '../entities/home-banner.entity';
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
    textColor: TextColor,
    isMain: boolean,
    image: string,
    mobileImage: string,
    statisticalTips: StatisticalTip[],
    infoTips: string[],
    filters: HomeBannerFilter[],
  ) {
    super(
      id,
      title,
      description,
      buttonText,
      textColor,
      isMain,
      image,
      mobileImage,
      statisticalTips,
      infoTips,
      filters,
    );
  }
}
