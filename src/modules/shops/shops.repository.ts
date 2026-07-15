import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Shop } from 'src/modules/shops/shops.model';

@Injectable()
export class ShopsRepository {
  constructor(@InjectModel(Shop) private readonly shopModel: typeof Shop) {}

/**
 * Creates a shop row in the database.
 *
 * @param {Partial<Shop>} shop - Shop fields to save.
 * @returns {Promise<Shop>} The created shop row.
 * @throws {Error} If the database insert fails.
 */

  async create(shop: Partial<Shop>): Promise<Shop> {
    return this.shopModel.create(shop);
  }

/**
 * Fetches all shops from the database.
 *
 * @returns {Promise<Shop[]>} All shop rows.
 * @throws {Error} If the database query fails.
 */

  async findAll(): Promise<Shop[]> {
    return this.shopModel.findAll();
  }

/**
 * Fetches a single shop by ID.
 *
 * @param {string} id - Shop ID to look up.
 * @returns {Promise<Shop | null>} The shop row - can be null at runtime if not found.
 * @throws {Error} If the database query fails.
 */

  async findOne(id: string): Promise<Shop | null> {
    return this.shopModel.findByPk(id);
  }

  /**
 * Updates a shop by ID and returns the updated row.
 *
 * @param {string} id - Shop ID to update.
 * @param {Partial<Shop>} shop - Fields to update.
 * @returns {Promise<Shop | undefined>} The updated shop row - can be undefined at runtime if not found.
 * @throws {Error} If the database update fails.
 */

  async update(id: string, shop: Partial<Shop>): Promise<Shop | undefined> {
    const result = await this.shopModel.update(shop, {
      where: { id },
      returning: true,
    });

    return result[1][0];
  }

/**
 * Deletes a shop by ID.
 *
 * @param {string} id - Shop ID to delete.
 * @returns {Promise<void>} Resolves when the delete query finishes.
 * @throws {Error} If the database delete fails.
 */

  async delete(id: string): Promise<void> {
    await this.shopModel.destroy({ where: { id } });
  }
}
