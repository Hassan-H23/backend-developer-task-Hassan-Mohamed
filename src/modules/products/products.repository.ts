import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from 'src/modules/products/products.model';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  async findWithFilter(filters: Partial<Product>): Promise<Product[]> {
    return this.productModel.findAll({ where: filters });
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async create(product: Partial<Product>): Promise<Product> {
  return this.productModel.create(product);
}

}
