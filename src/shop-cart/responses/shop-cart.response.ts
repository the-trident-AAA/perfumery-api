import { ShopCartPerfumeResponse } from 'src/shop-cart-perfume/responses/shop-cart-perfume.response';

export class ShopCartResponse {
  id: string;
  shopCartPerfumes: ShopCartPerfumeResponse[];

  constructor(id: string, shopCartPerfumes: ShopCartPerfumeResponse[]) {
    this.id = id;
    this.shopCartPerfumes = shopCartPerfumes;
  }
}
