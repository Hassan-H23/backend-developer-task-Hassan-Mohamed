import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from '../members/members.controller';
import { MembersService } from '../members/members.service';
import { CreateMemberDTO } from '../members/dto/create-member.dto';
import { UpdateMemberDTO } from '../members/dto/update-member.dto';

describe('MembersController', () => {
  let controller: MembersController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
  });

  it('calls service.create', async () => {
    const dto: CreateMemberDTO = {
      firstName: 'Ali',
      lastName: 'Hassan',
      gender: 'male',
      dateOfBirth: '1995-05-20',
    };

    const created = {
      id: '1',
      ...dto,
      subscriptionDate: '2026-07-14T00:00:00.000Z',
    };

    service.create.mockResolvedValue(created);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('calls service.findAll with pagination params', async () => {
    const members = [{ id: '1' }];
    service.findAll.mockResolvedValue(members);

    const result = await controller.findAll('10', '0');

    expect(service.findAll).toHaveBeenCalledWith('10', '0');
    expect(result).toEqual(members);
  });

  it('calls service.findOne', async () => {
    const member = { id: 'member-id' };
    service.findOne.mockResolvedValue(member);

    const result = await controller.findOne('member-id');

    expect(service.findOne).toHaveBeenCalledWith('member-id');
    expect(result).toEqual(member);
  });

  it('calls service.update', async () => {
    const dto: UpdateMemberDTO = { phone: '01234567890' };
    const updated = { id: 'member-id', phone: '01234567890' };
    service.update.mockResolvedValue(updated);

    const result = await controller.update('member-id', dto);

    expect(service.update).toHaveBeenCalledWith('member-id', dto);
    expect(result).toEqual(updated);
  });

  it('calls service.delete', async () => {
    service.delete.mockResolvedValue(undefined);

    await controller.delete('member-id');

    expect(service.delete).toHaveBeenCalledWith('member-id');
  });
});