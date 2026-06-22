import { Repository } from "typeorm";
import { AppDataSource } from "../../database/source";
import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { Specification } from "../../lib/specifications-base/base.specifications";
import { ProductMapper } from "../mappers/product.mapper";
import { ProductPersistenceEntity } from "../persistence/product-persistence.entity";

export class ProductRepositoryImpl implements ProductRepository {
  private getRepo(): Repository<ProductPersistenceEntity> {
    return AppDataSource.getRepository(ProductPersistenceEntity);
  }

  async findAll({
    skip,
    take,
  }: {
    skip?: number;
    take?: number;
  }): Promise<ProductEntity[]> {
    const models = await this.getRepo().find({ skip, take });
    return models.map((m) => ProductMapper.toEntity(m));
  }

  async findOne(
    spec: Specification<ProductPersistenceEntity>,
  ): Promise<ProductEntity | null> {
    const model = await this.getRepo().findOneBy(spec.toWhere());
    return model ? ProductMapper.toEntity(model) : null;
  }

  async save(productEntity: ProductEntity): Promise<ProductEntity> {
    const repo = this.getRepo();
    const data = ProductMapper.toPersistence(productEntity);
    const model = repo.create(data);
    const saved = await repo.save(model);
    return ProductMapper.toEntity(saved);
  }

  async update(data: ProductEntity): Promise<ProductEntity | null> {
    const repo = this.getRepo();
    const model = await repo.findOneBy({ id: data.getId() });

    if (!model) return null;

    model.name = data.getName();
    model.price = data.getPrice();

    const saved = await repo.save(model);
    return ProductMapper.toEntity(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.getRepo().delete(id);
    return (result.affected ?? 0) > 0;
  }
}
