import { Test, TestingModule } from '@nestjs/testing';
import { ShopsController } from './shops.controller';
import { ShopsService } from './shops.service';
import { CreateShopDTO } from './dto/create-shop.dto';
import { UpdateShopDTO } from './dto/update-shop.dto';

describe('ShopsController', () => {
  let controller: ShopsController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findAllWithProducts: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllWithProducts: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopsController],
      providers: [
        {
          provide: ShopsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<ShopsController>(ShopsController);
  });

  it('calls service.create', async () => {
    const dto: CreateShopDTO = {
      name: 'Main Shop',
      openingHour: new Date('2026-07-15T09:00:00.000Z'),
      closingHour: new Date('2026-07-15T18:00:00.000Z'),
      availability: 'open',
    };

    const created = {
      id: 'shop-id',
      ...dto,
    };

    service.create.mockResolvedValue(created);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('calls service.findAll', async () => {
    const shops = [{ id: '1' }];
    service.findAll.mockResolvedValue(shops);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(shops);
  });

  it('calls service.findAllWithProducts', async () => {
    const shops = [{ id: '1', products: [] }];
    service.findAllWithProducts.mockResolvedValue(shops);

    const result = await controller.findAllWithProducts();

    expect(service.findAllWithProducts).toHaveBeenCalled();
    expect(result).toEqual(shops);
  });

  it('calls service.findOne', async () => {
    const shop = { id: 'shop-id' };
    service.findOne.mockResolvedValue(shop);

    const result = await controller.findOne('shop-id');

    expect(service.findOne).toHaveBeenCalledWith('shop-id');
    expect(result).toEqual(shop);
  });

  it('calls service.update', async () => {
    const dto: UpdateShopDTO = { availability: 'busy' };
    const updated = { id: 'shop-id', availability: 'busy' };

    service.update.mockResolvedValue(updated);

    const result = await controller.update('shop-id', dto);

    expect(service.update).toHaveBeenCalledWith('shop-id', dto);
    expect(result).toEqual(updated);
  });

  it('calls service.delete', async () => {
    service.delete.mockResolvedValue(undefined);

    await controller.delete('shop-id');

    expect(service.delete).toHaveBeenCalledWith('shop-id');
  });
});