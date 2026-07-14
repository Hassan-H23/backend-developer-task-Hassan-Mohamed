import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Param,
  Patch,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductDTO } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

@Post()
async create(@Body() createProductDto: CreateProductDTO): Promise<ProductDTO> {
  return this.productService.create(createProductDto);
}
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductDTO> {
    return this.productService.findOne(id);
  }
  @Get()
async findAll(@Query('search') search?: string): Promise<ProductDTO[]> {
  return this.productService.findAll(search);
}
@Delete(':id')

@HttpCode(HttpStatus.NO_CONTENT)
async delete(@Param('id') id: string): Promise<void> {
  return this.productService.delete(id);
}

@Patch(':id')
  async update(
      @Param('id') id: string,
      @Body() updateProductDto: UpdateProductDTO,
    ): Promise<ProductDTO> {
      return this.productService.update(id, updateProductDto);
    }
}
