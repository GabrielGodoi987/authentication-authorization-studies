import { ProductPersistenceEntity } from "../../infrastructure/persistence/product-persistence.entity";
import { WhereSpecification } from "../../lib/specifications-base/base.specifications";

export class FindProductByIdSpec extends WhereSpecification<ProductPersistenceEntity> {
  constructor(id: string) {
    super({ id });
  }
}
