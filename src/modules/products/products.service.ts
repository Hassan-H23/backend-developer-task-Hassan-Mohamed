import { Injectable } from '@nestjs/common';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { ProductDTO } from 'src/modules/products/dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async findWithFilter(filter: Partial<ProductDTO>): Promise<ProductDTO[]> {
    return this.repository.findWithFilter(filter);
  }
}
