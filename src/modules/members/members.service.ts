import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateMemberDTO } from 'src/modules/members/dto/create-member.dto';
import { MemberDTO } from 'src/modules/members/dto/member.dto';
import { UpdateMemberDTO } from 'src/modules/members/dto/update-member.dto';
import { MembersRepository } from 'src/modules/members/members.repository';

@Injectable()
export class MembersService {
  constructor(private readonly repository: MembersRepository) {}

/**
 * Creates a new member.
 * 
 * @param member - The member data to create
 * @returns The created member
 * @throws BadRequestException when centralMemberId does not exist
 * @throws BadRequestException when the chosen central member is already a family member
 */

async create(member: CreateMemberDTO): Promise<MemberDTO> {
  if (member.centralMemberId) {
    const centralMember = await this.repository.findOne(member.centralMemberId);

    if (!centralMember) {
      throw new BadRequestException(
        `Central member with id ${member.centralMemberId} not found`,
      );
    }

    if (centralMember.centralMemberId) {
      throw new BadRequestException(
        'A family member cannot be a central member',
      );
    }
  }

  return this.repository.create({
    ...member,
    subscriptionDate: new Date().toISOString(),
  });
}

/**
 * Finds members using simple pagination.
 * Returns at most 100 members per request.
 * 
 * @param limit - Maximum number of members to return
 * @param offset - Number of members to skip
 * @returns The list of members
 * @throws BadRequestException when limit or offset is invalid
 */

 async findAll(limit?: string, offset?: string): Promise<MemberDTO[]> {
  const parsedLimit = limit ? Number(limit) : 50;
  const parsedOffset = offset ? Number(offset) : 0;

  if (parsedLimit > 100) {
    throw new BadRequestException('limit must not exceed 100');
    }

  if (Number.isNaN(parsedLimit) || parsedLimit <= 0) {
    throw new BadRequestException('limit must be a positive number');
    }

  if (Number.isNaN(parsedOffset) || parsedOffset < 0) {
    throw new BadRequestException('offset must be zero or greater');
    }

  return this.repository.findAll(parsedLimit, parsedOffset);
}

/**
 * Finds a member by id.
 * 
 * @param id - The member id
 * @returns The matching member
 * @throws NotFoundException when the member does not exist
 */
 async findOne(id: string): Promise<MemberDTO> {
  const member = await this.repository.findOne(id);

  if (!member) {
    throw new NotFoundException(`Member with id ${id} not found`);
  }

  return member;
}

/**
 * Updates an existing member.
 * 
 * @param id - The id of the member to update
 * @param member - The member fields to update
 * @returns The updated member
 * @throws NotFoundException when the member does not exist
 * @throws BadRequestException when no fields are provided
 * @throws BadRequestException when the member is their own central member
 * @throws BadRequestException when centralMemberId does not exist
 * @throws BadRequestException when the chosen central member is already a family member
 * @throws BadRequestException when a central member is being converted into a family member
 */

async update(id: string, member: UpdateMemberDTO): Promise<MemberDTO> {
  const existingMember = await this.repository.findOne(id);

  if (!existingMember) {
    throw new NotFoundException(`Member with id ${id} not found`);
  }

  if (Object.keys(member).length === 0) {
    throw new BadRequestException(
      'At least one field must be provided for update',
    );
  }

  if (member.centralMemberId && member.centralMemberId === id) {
    throw new BadRequestException('Member cannot be their own central member');
  }

  if (member.centralMemberId) {
    const centralMember = await this.repository.findOne(member.centralMemberId);

    if (!centralMember) {
      throw new BadRequestException(
        `Central member with id ${member.centralMemberId} not found`,
      );
    }

    if (centralMember.centralMemberId) {
      throw new BadRequestException(
        'A family member cannot be a central member',
      );
    }
  }

  if (member.centralMemberId) {
    const dependents = await this.repository.findByCentralMemberId(id);

    if (dependents.length > 0) {
      throw new BadRequestException(
        'A central member cannot become a family member',
      );
    }
  }

  return this.repository.update(id, member);
}

/**
 * Deletes a member by id.
 * 
 * @param id - The member id
 * @returns Nothing
 * @throws NotFoundException when the member does not exist
 */

  async delete(id: string): Promise<void> {
  const existingMember = await this.repository.findOne(id);

  if (!existingMember) {
    throw new NotFoundException(`Member with id ${id} not found`);
  }

  await this.repository.delete(id);
}
}
