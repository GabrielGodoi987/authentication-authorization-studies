import { ProductPersistenceEntity } from "../../infrastructure/persistence/product-persistence.entity";
import { Specification } from "../../lib/specifications-base/base.specifications";
import { ProductEntity } from "../entities/product.entity";

export interface ProductRepository {
  findAll({
    skip,
    take,
  }: {
    skip?: number;
    take?: number;
  }): Promise<ProductEntity[]>;
  findOne(
    spec: Specification<ProductPersistenceEntity>,
  ): Promise<ProductEntity | null>;
  save(productEntity: ProductEntity): Promise<ProductEntity>;
  update(data: ProductEntity): Promise<ProductEntity | null>;
  delete(id: string): Promise<boolean>;
}
