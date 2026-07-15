import { Injectable,  BadRequestException,  NotFoundException, ConflictException, } from '@nestjs/common';
import { ProductsService } from 'src/modules/products/products.service';
import { CreateShopDTO } from 'src/modules/shops/dto/create-shop.dto';
import { ShopWithProductsDTO } from 'src/modules/shops/dto/shop-with-products.dto';
import { ShopDTO } from 'src/modules/shops/dto/shop.dto';
import { UpdateShopDTO } from 'src/modules/shops/dto/update-shop.dto';
import { ShopsRepository } from 'src/modules/shops/shops.repository';

@Injectable()
export class ShopsService {
  constructor(
    private readonly repository: ShopsRepository,
    private readonly productsService: ProductsService,
  ) {}

 /**
   * Creates a new shop.
   * @param shop - The shop data to create
   * @returns The created shop
   * @throws BadRequestException when closingHour is not after openingHour
   */
  async create(shop: CreateShopDTO): Promise<ShopDTO> {
    this.validateHours(shop.openingHour, shop.closingHour);
    return this.repository.create(shop);
  }
  /**
   * Finds all shops.
   * @returns The list of shops
   */
  async findAll(): Promise<ShopDTO[]> {
    return this.repository.findAll();
  }

 /**
   * Finds all shops with their products.
   * Fetches shops first, then loads products in bulk and groups them by shopId
   * to avoid issuing one query per shop.
   * @returns All shops with their products
   */
  async findAllWithProducts(): Promise<ShopWithProductsDTO[]> {
    const shops = await this.repository.findAll();
    const products = await this.productsService.findAll();

    const productsByShopId = new Map<string, typeof products>();

    for (const product of products) {
      const shopProducts = productsByShopId.get(product.shopId) ?? [];
      shopProducts.push(product);
      productsByShopId.set(product.shopId, shopProducts);
    }

    return shops.map((shop) => ({
      ...shop,
      products: productsByShopId.get(shop.id) ?? [],
    }));
  }

 /**
   * Finds a shop by id.
   * @param id - The shop id
   * @returns The matching shop
   * @throws NotFoundException when the shop does not exist
   */
  async findOne(id: string): Promise<ShopDTO> {
    const shop = await this.repository.findOne(id);

    if (!shop) {
      throw new NotFoundException(`Shop with id ${id} not found`);
    }
    return shop;
  }

 /**
   * Updates an existing shop.
   * @param id - The id of the shop to update
   * @param shop - The shop fields to update
   * @returns The updated shop
   * @throws NotFoundException when the shop does not exist
   * @throws BadRequestException when no fields are provided
   * @throws BadRequestException when closingHour is not after openingHour
   */
  async update(id: string, shop: UpdateShopDTO): Promise<ShopDTO> {

     const existingShop = await this.repository.findOne(id);

      if (!existingShop) {
      throw new NotFoundException(`Shop with id ${id} not found`);
    }

     if (Object.keys(shop).length === 0) {
      throw new BadRequestException(
        'At least one field must be provided for update',
      );
    }
    const openingHour = shop.openingHour ?? existingShop.openingHour;
    const closingHour = shop.closingHour ?? existingShop.closingHour;

    this.validateHours(openingHour, closingHour);

    return this.repository.update(id, shop);
  }
  /**
   * Deletes a shop by id.
   * @param id - The shop id
   * @returns Nothing
   * @throws NotFoundException when the shop does not exist
   * @throws ConflictException when the shop still has products
   */
  async delete(id: string):  Promise<void> {
    const existingShop = await this.repository.findOne(id);

    if (!existingShop) {
      throw new NotFoundException(`Shop with id ${id} not found`);
    }
    

    const products = await this.productsService.findWithFilter({ shopId: id });
    if (products.length > 0) {
    throw new ConflictException(
      'Cannot delete a shop that still has products',
    );
  }
  await this.repository.delete(id);
  }

  /**
   * Validates that a shop closes after it opens.
   * @param openingHour - The shop opening time
   * @param closingHour - The shop closing time
   * @throws BadRequestException when closingHour is not after openingHour
   */
  private validateHours(openingHour: Date, closingHour: Date): void {
    if (new Date(closingHour) <= new Date(openingHour)) {
      throw new BadRequestException(
        'closingHour must be later than openingHour',
      );
    }
  }
}
