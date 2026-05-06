import { ProductDTO } from 'src/modules/products/dto/product.dto';
import { ShopDTO } from 'src/modules/shops/dto/shop.dto';

export class ShopWithProductsDTO extends ShopDTO {
  products: ProductDTO[];
}
