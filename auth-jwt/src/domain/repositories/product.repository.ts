import { ProductPersistenceEntity } from "../../infrastructure/persistence/product-persistence.entity";
import { Specification } from "../../lib/specifications-base/base.specifications";
import { ProductEntity } from "../entities/product.entity";
import { UserEntity } from "../entities/user.entity";

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
  ): Promise<UserEntity | null>;
  update(
    id: string,
    data: Partial<ProductEntity>,
  ): Promise<ProductEntity | null>;
  delete(id: string): Promise<boolean>;
}
