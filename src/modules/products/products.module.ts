import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from 'src/modules/products/products.model';
import { Shop } from 'src/modules/shops/shops.model';
import { ProductsController } from 'src/modules/products/products.controller';
import { ProductsService } from 'src/modules/products/products.service';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { ShopsRepository } from 'src/modules/shops/shops.repository';

@Module({
  imports: [SequelizeModule.forFeature([Product, Shop])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    ShopsRepository,
  ],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}