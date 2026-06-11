import { v4 } from "uuid";
import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductMapper } from "../../infrastructure/mappers/product.mapper";
import { ProductPersistenceEntity } from "../../infrastructure/persistence/product-persistence.entity";
import { getDataSource } from "../source";

export async function productSeeder() {
  const ds = getDataSource();
  const repo = ds.getRepository(ProductPersistenceEntity);

  try {
    const products: ProductEntity[] = Array.from({ length: 10 }, (_, i) => {
      return new ProductEntity(v4(), `Product ${i}`, 12);
    });

    const productsToPersistence = products.map((prod) =>
      ProductMapper.toPersistence(prod),
    );

    await repo.save(productsToPersistence);

    return {
      success: true,
      message: `🌱 Seeded ${products.length}`,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message: `❌ Failed to seed products: ${error.message}`,
    };
  }
}
