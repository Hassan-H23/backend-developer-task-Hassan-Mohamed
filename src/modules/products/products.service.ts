import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { ProductDTO } from 'src/modules/products/dto/product.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ShopsRepository } from 'src/modules/shops/shops.repository';
@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository,
    private readonly shopsRepository: ShopsRepository, //fetch shops to make sure that they exist before creating a product
  ) {}
  
/**
 * Creates a new product.
 * @param product - The product data to create
 * @returns The created product
 * @throws BadRequestException when the referenced shop does not exist
 * @throws BadRequestException when a product with the same name already exists in the shop - case-insensitive
 */
async create(product: CreateProductDTO): Promise<ProductDTO> {
  const shop = await this.shopsRepository.findOne(product.shopId);

  if (!shop) {
    throw new BadRequestException(
      `Shop with id ${product.shopId} does not exist`,
    );
  }

const existingProduct = await this.repository.findByShopIdAndName(
  product.shopId,
  product.name,
);

if (existingProduct) {
  throw new BadRequestException(
    `Product with name ${product.name} already exists in this shop`,
  );
  }

  return this.repository.create(product);
}

  async findWithFilter(filter: Partial<ProductDTO>): Promise<ProductDTO[]> {
    return this.repository.findWithFilter(filter);
  }
/**
 * Finds a product by its id.
 * @param id - The product id
 * @returns The matching product
 */
  async findOne(id: string): Promise<ProductDTO> {
  const product = await this.repository.findOne(id);

  if (!product) { // Check if the product exists
    throw new NotFoundException(`Product with id ${id} not found`);
  }

  return product;
}

/**
 * Deletes a product by id.
 * @param id - The product id
 * @returns Nothing
 * @throws NotFoundException when the product does not exist
 */
async delete(id: string): Promise<void> {
  const product = await this.repository.findOne(id);

  if (!product) {
    throw new NotFoundException(`Product with id ${id} not found`);
  }

  await this.repository.delete(id);
}

/**
 * Updates an existing product.
 * @param id - The id of the product to update
 * @param product - The product fields to update
 * @returns The updated product
 * @throws NotFoundException when the product does not exist
 * @throws BadRequestException when no fields are provided or stockCount is invalid
 */
async update(id: string, product: UpdateProductDTO): Promise<ProductDTO> {
  const existingProduct = await this.repository.findOne(id);

  if (!existingProduct) {
    throw new NotFoundException(`Product with id ${id} not found`);
  }
  if (Object.keys(product).length === 0) {
    throw new BadRequestException('At least one field must be provided for update');
  }
  
  if (product.stockCount !== undefined && product.stockCount < 1) {
  throw new BadRequestException('stockCount must be at least 1');
}

  return this.repository.update(id, product);
}
/**
 * Finds all products, optionally filtered by a case-insensitive name search.
 * @param search - Optional product name search term
 * @returns The list of matching products
 */

async findAll(search?: string): Promise<ProductDTO[]> {
  return this.repository.findAll(search);
}

}
