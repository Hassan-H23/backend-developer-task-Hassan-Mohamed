import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from '../members/members.service';
import { MembersRepository } from '../members/members.repository';
import { CreateMemberDTO } from '../members/dto/create-member.dto';
import { UpdateMemberDTO } from '../members/dto/update-member.dto';

describe('MembersService', () => {
  let service: MembersService;
  let repository: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    findByCentralMemberId: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByCentralMemberId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: MembersRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  describe('create', () => {
    it('creates a member and sets subscriptionDate automatically', async () => {
      const dto: CreateMemberDTO = {
        firstName: 'Ali',
        lastName: 'Hassan',
        gender: 'male',
        dateOfBirth: '1995-05-20',
        phone: '01000000000',
      };

      const createdMember = {
        id: 'member-id',
        ...dto,
        subscriptionDate: '2026-07-14T00:00:00.000Z',
      };

      repository.create.mockResolvedValue(createdMember);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        subscriptionDate: expect.any(String),
      });
      expect(result).toEqual(createdMember);
    });

    it('throws when centralMemberId does not exist', async () => {
      const dto: CreateMemberDTO = {
        firstName: 'Sara',
        lastName: 'Omar',
        gender: 'female',
        dateOfBirth: '1998-03-14',
        centralMemberId: 'missing-id',
      };

      repository.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('throws when chosen central member is already a family member', async () => {
      const dto: CreateMemberDTO = {
        firstName: 'Sara',
        lastName: 'Omar',
        gender: 'female',
        dateOfBirth: '1998-03-14',
        centralMemberId: 'family-member-id',
      };

      repository.findOne.mockResolvedValue({
        id: 'family-member-id',
        centralMemberId: 'another-member-id',
      });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns paginated members', async () => {
      const members = [{ id: '1' }, { id: '2' }];
      repository.findAll.mockResolvedValue(members);

      const result = await service.findAll('10', '5');

      expect(repository.findAll).toHaveBeenCalledWith(10, 5);
      expect(result).toEqual(members);
    });

    it('uses default pagination values', async () => {
      repository.findAll.mockResolvedValue([]);

      await service.findAll();

      expect(repository.findAll).toHaveBeenCalledWith(50, 0);
    });

    it('throws when limit is invalid', async () => {
      await expect(service.findAll('0', '0')).rejects.toThrow(BadRequestException);
      expect(repository.findAll).not.toHaveBeenCalled();
    });

    it('throws when offset is invalid', async () => {
      await expect(service.findAll('10', '-1')).rejects.toThrow(BadRequestException);
      expect(repository.findAll).not.toHaveBeenCalled();
    });

    it('throws when limit exceeds 100', async () => {
      await expect(service.findAll('101', '0')).rejects.toThrow(BadRequestException);
      expect(repository.findAll).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns a member when found', async () => {
      const member = { id: 'member-id' };
      repository.findOne.mockResolvedValue(member);

      const result = await service.findOne('member-id');

      expect(result).toEqual(member);
    });

    it('throws when member does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates a member successfully', async () => {
      const dto: UpdateMemberDTO = { phone: '01234567890' };
      const existingMember = { id: 'member-id', centralMemberId: null };
      const updatedMember = { id: 'member-id', phone: '01234567890' };

      repository.findOne.mockResolvedValue(existingMember);
      repository.update.mockResolvedValue(updatedMember);

      const result = await service.update('member-id', dto);

      expect(repository.update).toHaveBeenCalledWith('member-id', dto);
      expect(result).toEqual(updatedMember);
    });

    it('throws when member does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('missing-id', { phone: '1' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws on empty update body', async () => {
      repository.findOne.mockResolvedValue({ id: 'member-id' });

      await expect(service.update('member-id', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws when member is their own central member', async () => {
      repository.findOne.mockResolvedValue({ id: 'member-id' });

      await expect(
        service.update('member-id', { centralMemberId: 'member-id' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws when central member does not exist', async () => {
      repository.findOne
        .mockResolvedValueOnce({ id: 'member-id' })
        .mockResolvedValueOnce(null);

      await expect(
        service.update('member-id', { centralMemberId: 'missing-central' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws when chosen central member is already a family member', async () => {
      repository.findOne
        .mockResolvedValueOnce({ id: 'member-id' })
        .mockResolvedValueOnce({
          id: 'central-id',
          centralMemberId: 'another-id',
        });

      await expect(
        service.update('member-id', { centralMemberId: 'central-id' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws when a central member is being converted into a family member', async () => {
      repository.findOne
        .mockResolvedValueOnce({ id: 'member-id' })
        .mockResolvedValueOnce({
          id: 'new-central-id',
          centralMemberId: null,
        });

      repository.findByCentralMemberId.mockResolvedValue([{ id: 'dependent-id' }]);

      await expect(
        service.update('member-id', { centralMemberId: 'new-central-id' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('deletes a member successfully', async () => {
      repository.findOne.mockResolvedValue({ id: 'member-id' });
      repository.delete.mockResolvedValue(undefined);

      await service.delete('member-id');

      expect(repository.delete).toHaveBeenCalledWith('member-id');
    });

    it('throws when member does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.delete('missing-id')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});