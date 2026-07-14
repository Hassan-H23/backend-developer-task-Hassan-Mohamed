import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from 'src/modules/members/members.model';

@Injectable()
export class MembersRepository {
  constructor(
    @InjectModel(Member) private readonly memberModel: typeof Member,
  ) {}

  /**
   * Creates a member row in the database.
   *
   * @param {Partial<Member>} member - Member fields to save.
   * @returns {Promise<Member>} The created member row.
   * @throws {Error} If the database insert fails (for example: DB is down, invalid column value).
   */
  async create(member: Partial<Member>): Promise<Member> {
    return this.memberModel.create(member);
  }

  /**
   * Fetches all members from the database.
   *
   * @returns {Promise<Member[]>} All members rows.
   * @throws {Error} If the database query fails.
   */
async findAll(limit = 50, offset = 0): Promise<Member[]> {
  
  return this.memberModel.findAll({
    limit,
    offset,
  });
}


  async findByCentralMemberId(centralMemberId: string): Promise<Member[]> {
    return this.memberModel.findAll({
      where: { centralMemberId },
    });
  }

  /**
   * Fetches a single member by ID.
   *
   * @param {string} id - Member ID to look up.
   * @returns {Promise<Member>} The member row (can be `null` at runtime if not found).
   * @throws {Error} If the database query fails.
   */
  async findOne(id: string): Promise<Member> {
    return this.memberModel.findByPk(id);
  }

  /**
   * Updates a member by ID and returns the updated row.
   *
   * @param {string} id - Member ID to update.
   * @param {Partial<Member>} member - Fields to update.
   * @returns {Promise<Member>} The updated member row (can be `undefined` at runtime if not found).
   * @throws {Error} If the database update fails.
   */
  async update(id: string, member: Partial<Member>): Promise<Member> {
    const result = await this.memberModel.update(member, {
      where: { id },
      returning: true,
    });

    return result[1][0];
  }

  /**
   * Deletes a member by ID.
   *
   * @param {string} id - Member ID to delete.
   * @returns {Promise<void>} Resolves when the delete query finishes.
   * @throws {Error} If the database delete fails.
   */
  async delete(id: string): Promise<void> {
    await this.memberModel.destroy({ where: { id } });
  }
}
