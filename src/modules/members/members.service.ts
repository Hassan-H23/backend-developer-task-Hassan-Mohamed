import { Injectable } from '@nestjs/common';
import { CreateMemberDTO } from 'src/modules/members/dto/create-member.dto';
import { MemberDTO } from 'src/modules/members/dto/member.dto';
import { UpdateMemberDTO } from 'src/modules/members/dto/update-member.dto';
import { MembersRepository } from 'src/modules/members/members.repository';

@Injectable()
export class MembersService {
  constructor(private readonly repository: MembersRepository) {}

  /**
   * This method creates a new member
   * @param member - The member to create
   * @returns The created member
   */
  async create(member: CreateMemberDTO): Promise<MemberDTO> {
    return this.repository.create(member);
  }

  /**
   * This method finds all members
   * FIXME: A club can have more than 100k members, wow!
   * Can we find a way to return the members in an efficient way?
   */
  async findAll(): Promise<MemberDTO[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<MemberDTO> {
    return this.repository.findOne(id);
  }

  async update(id: string, member: UpdateMemberDTO): Promise<MemberDTO> {
    return this.repository.update(id, member);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
