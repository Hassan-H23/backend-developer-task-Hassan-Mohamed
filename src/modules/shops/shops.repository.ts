import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Shop } from 'src/modules/shops/shops.model';

@Injectable()
export class ShopsRepository {
  constructor(@InjectModel(Shop) private readonly shopModel: typeof Shop) {}

  async create(shop: Partial<Shop>): Promise<Shop> {
    return this.shopModel.create(shop);
  }

  async findAll(): Promise<Shop[]> {
    return this.shopModel.findAll();
  }

  async findOne(id: string): Promise<Shop> {
    return this.shopModel.findByPk(id);
  }

  async update(id: string, shop: Partial<Shop>): Promise<Shop> {
    const result = await this.shopModel.update(shop, {
      where: { id },
      returning: true,
    });

    return result[1][0];
  }

  async delete(id: string): Promise<void> {
    await this.shopModel.destroy({ where: { id } });
  }
}
