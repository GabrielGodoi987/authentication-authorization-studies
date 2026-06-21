import { ProductNotFoundException } from "../domain/domain-exceptions/product.exceptions";
import { ProductRepository } from "../domain/repositories/product.repository";
import { FindProductByIdSpec } from "../domain/specifications/product.specification";

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

  execute() {}
}
