import { v4 } from "uuid";
import { ProductNotFoundException } from "../domain/domain-exceptions/product.exceptions";
import { ProductEntity } from "../domain/entities/product.entity";
import { ProductRepository } from "../domain/repositories/product.repository";
import { FindProductByIdSpec } from "../domain/specifications/product.specification";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

export class FindAllProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({ skip = 0, take = 10 }: { skip: number; take: number }) {
    try {
      return await this.productRepository.findAll({ skip, take });
    } catch (error: any) {
      console.info(error.message);
      console.error(error);
      return error;
    }
  }
}

export class FindByIdProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({ id }: { id: string }) {
    try {
      const product = await this.productRepository.findOne(
        new FindProductByIdSpec(id),
      );

      if (!product) {
        throw new ProductNotFoundException({
          message: `Product: ${id} was not found`,
        });
      }

      return product;
    } catch (error: any) {
      console.info(error.message);
      console.error(error);
      return error;
    }
  }
}

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(createProductDto: CreateProductDto) {
    const { name, price } = createProductDto;

    try {
      const productEntity = new ProductEntity(v4(), name, price);

      return await this.productRepository.save(productEntity);
    } catch (error: any) {
      console.info(error.message);
      console.error(error);
      return error;
    }
  }
}

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, updateProductdto: UpdateProductDto) {
    const doesProductExists = await this.productRepository.findOne(
      new FindProductByIdSpec(id),
    );

    if (!doesProductExists) {
      throw new ProductNotFoundException({
        message: `Product with id ${id} was not found`,
      });
    }

    const updateProduct = new ProductEntity(
      doesProductExists.getId(),
      updateProductdto.name == null
        ? doesProductExists.getName()
        : updateProductdto.name,
      updateProductdto.price == null
        ? doesProductExists.getPrice()
        : updateProductdto.price,
    );

    return this.productRepository.update(updateProduct);
  }
}

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string) {
    try {
      const doesProductExists = await this.productRepository.findOne(
        new FindProductByIdSpec(id),
      );

      if (!doesProductExists) {
        throw new ProductNotFoundException({
          message: `Product ${id} was not found`,
        });
      }

      return await this.productRepository.delete(id);
    } catch (error: any) {
      console.info(error.message);
      console.error(error);
      return error;
    }
  }
}
