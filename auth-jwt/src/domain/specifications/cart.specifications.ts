import { CartPersistenceEntity } from "../../infrastructure/persistence/cart-persistence.entity";
import { WhereSpecification } from "../../lib/specifications-base/base.specifications";

export class FindCartByIdSpec extends WhereSpecification<CartPersistenceEntity> {
  constructor(id: string) {
    super({ id });
  }
}

export class FindCartByUserIdSpec extends WhereSpecification<CartPersistenceEntity> {
  constructor(userId: string) {
    super({ userId });
  }
}

export class FindAllCartsSpec extends WhereSpecification<CartPersistenceEntity> {
  constructor() {
    super({});
  }
}
