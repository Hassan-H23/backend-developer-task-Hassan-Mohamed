import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { ProductDTO } from 'src/modules/products/dto/product.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { ShopsRepository } from 'src/modules/shops/shops.repository';
@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository,
    private readonly shopsRepository: ShopsRepository, //fetch shops to make sure that they exist before creating a product
  ) {}
  

   async create(product: CreateProductDTO): Promise<ProductDTO> {
    const shop = await this.shopsRepository.findOne(product.shopId);

    if (!shop) {
      throw new BadRequestException(
        `Shop with id ${product.shopId} does not exist`,
      );
    }

    return this.repository.create(product);
  }

  async findAll(): Promise<ProductDTO[]> {
     return this.repository.findAll();
   }

  async findWithFilter(filter: Partial<ProductDTO>): Promise<ProductDTO[]> {
    return this.repository.findWithFilter(filter);
  }
}
