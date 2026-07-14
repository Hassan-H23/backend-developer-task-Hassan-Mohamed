import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products/products.controller';
import { ProductsService } from '../products/products.service';
import { CreateProductDTO } from '../products/dto/create-product.dto';
import { UpdateProductDTO } from '../products/dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
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
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('calls service.create', async () => {
    const dto: CreateProductDTO = {
      shopId: 'shop-id',
      name: 'Apple Juice',
      description: 'Fresh juice bottle',
      price: 50,
      stockCount: 10,
    };

    const created = {
      id: 'product-id',
      ...dto,
    };

    service.create.mockResolvedValue(created);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('calls service.findAll without search', async () => {
    const products = [{ id: '1' }];
    service.findAll.mockResolvedValue(products);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(products);
  });

  it('calls service.findAll with search', async () => {
    const products = [{ id: '1', name: 'Apple Juice' }];
    service.findAll.mockResolvedValue(products);

    const result = await controller.findAll('app');

    expect(service.findAll).toHaveBeenCalledWith('app');
    expect(result).toEqual(products);
  });

  it('calls service.findOne', async () => {
    const product = { id: 'product-id' };
    service.findOne.mockResolvedValue(product);

    const result = await controller.findOne('product-id');

    expect(service.findOne).toHaveBeenCalledWith('product-id');
    expect(result).toEqual(product);
  });

  it('calls service.update', async () => {
    const dto: UpdateProductDTO = { price: 60 };
    const updated = { id: 'product-id', price: 60 };

    service.update.mockResolvedValue(updated);

    const result = await controller.update('product-id', dto);

    expect(service.update).toHaveBeenCalledWith('product-id', dto);
    expect(result).toEqual(updated);
  });

  it('calls service.delete', async () => {
    service.delete.mockResolvedValue(undefined);

    await controller.delete('product-id');

    expect(service.delete).toHaveBeenCalledWith('product-id');
  });
});