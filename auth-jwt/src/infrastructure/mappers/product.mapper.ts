import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductPersistenceEntity } from "../persistence/product-persistence.entity";

export class ProductMapper {
  public static toEntity(data: any): ProductEntity {
    return new ProductEntity(data.id, data.name, data.price);
  }

  public static toPersistence(
    product: ProductEntity,
  ): Partial<ProductPersistenceEntity> {
    return {
      id: product.getId(),
      name: product.getName(),
      price: product.getPrice(),
    };
  }
}
