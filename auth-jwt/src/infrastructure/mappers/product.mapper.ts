import { ProductEntity } from "../../domain/entities/product.entity";

export class ProductMapper{
  public static toEntity(data: any): ProductEntity {
    return new ProductEntity(data.id, data.name, data.price);
  }

  public static toPersistence(product: ProductEntity): any {
    return {
      id: product.getId(),
      name: product.getName(),
      price: product.getPrice(),
    };
  }
}