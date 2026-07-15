import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Product } from 'src/modules/products/products.model';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  /**
   * Finds products matching the provided filters.
   *
   * @param {Partial<Product>} filters - Product fields to filter by.
   * @returns {Promise<Product[]>} Matching products.
   * @throws {Error} If the database query fails.
   */

async findWithFilter(filters: Partial<Product>): Promise<Product[]> {
    return this.productModel.findAll({ where: filters });
  }

 /**
   * Finds all products, optionally filtered by a case-insensitive name search.
   *
   * @param {string} search - Optional search term.
   * @returns {Promise<Product[]>} Matching products.
   * @throws {Error} If the database query fails.
   */
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

  /**
   * Creates a product row in the database.
   *
   * @param {Partial<Product>} product - Product fields to save.
   * @returns {Promise<Product>} The created product row.
   * @throws {Error} If the database insert fails.
   */

  async create(product: Partial<Product> ): Promise<Product> {
  return this.productModel.create(product);
}

  /**
   * Fetches a single product by ID.
   *
   * @param {string} id - Product ID to look up.
   * @returns {Promise<Product | null>} The product row, or null if not found.
   * @throws {Error} If the database query fails.
   */

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findByPk(id);
  }

  /**
   * Deletes a product by ID.
   *
   * @param {string} id - Product ID to delete.
   * @returns {Promise<void>} Resolves when the delete query finishes.
   * @throws {Error} If the database delete fails.
   */

   async delete(id: string): Promise<void> {
    await this.productModel.destroy({ where: { id } });
  }

  /**
   * Updates a product by ID and returns the updated row.
   *
   * @param {string} id - Product ID to update.
   * @param {Partial<Product>} product - Fields to update.
   * @returns {Promise<Product | undefined>} The updated product row, or undefined if no row was returned.
   * @throws {Error} If the database update fails.
   */

  async update(id: string, product: Partial<Product>): Promise<Product | undefined> {
  const result = await this.productModel.update(product, {
    where: { id },
    returning: true,
  });

  return result[1][0];
}

  /**
   * Finds a product by shop ID and name using case-insensitive matching.
   *
   * @param {string} shopId - Shop ID that owns the product.
   * @param {string} name - Product name to search for.
   * @returns {Promise<Product | null>} Matching product, or null if none exists.
   * @throws {Error} If the database query fails.
   */
  
async findByShopIdAndName(shopId: string, name: string): Promise<Product | null> {
  return this.productModel.findOne({
    where: {
      shopId,
      name: {
        [Op.iLike]: name,
      },
    },
  });
}


}
