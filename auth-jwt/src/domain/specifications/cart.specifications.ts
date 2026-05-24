import { CartPersistenceEntity } from "../../infrastructure/persistence/cart-persistence.entity";

export interface CartSpecification {
  toWhere(): Partial<CartPersistenceEntity>;
}

export class FindCartByIdSpec implements CartSpecification {
  constructor(private readonly id: string) {}

  toWhere(): Partial<CartPersistenceEntity> {
    return { id: this.id };
  }
}

export class FindCartByUserIdSpec implements CartSpecification {
  constructor(private readonly userId: string) {}

  toWhere(): Partial<CartPersistenceEntity> {
    return { userId: this.userId };
  }
}

export class FindAllCartsSpec implements CartSpecification {
  toWhere(): Partial<CartPersistenceEntity> {
    return {};
  }
}
