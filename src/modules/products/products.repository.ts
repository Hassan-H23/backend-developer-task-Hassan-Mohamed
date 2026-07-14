import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Product } from 'src/modules/products/products.model';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  async findWithFilter(filters: Partial<Product>): Promise<Product[]> {
    return this.productModel.findAll({ where: filters });
  }

async findAll(search?: string): Promise<Product[]> {
  if (!search) {
    return this.productModel.findAll();
  }

  return this.productModel.findAll({
    where: {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    },
  });
}
  async create(product: Partial<Product>): Promise<Product> {
  return this.productModel.create(product);
}
  async findOne(id: string): Promise<Product> {
    return this.productModel.findByPk(id);
  }
   async delete(id: string): Promise<void> {
    await this.productModel.destroy({ where: { id } });
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
  const result = await this.productModel.update(product, {
    where: { id },
    returning: true,
  });

  return result[1][0];
}


}
