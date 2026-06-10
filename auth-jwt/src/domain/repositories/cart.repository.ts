import { CartPersistenceEntity } from "../../infrastructure/persistence/cart-persistence.entity";
import { WhereSpecification } from "../../lib/specifications-base/base.specifications";
import { CartItemsEntity } from "../entities/cart-items.entity";
import { CartEntity } from "../entities/cart.entity";

export interface CartRepository {
  save(cart: CartEntity): Promise<CartEntity>;
  findOne(
    spec: WhereSpecification<CartPersistenceEntity>,
  ): Promise<CartEntity | null>;
  find(spec: WhereSpecification<CartPersistenceEntity>): Promise<CartEntity[]>;
  delete(id: string): Promise<boolean>;
  saveProduct(product: CartItemsEntity): Promise<CartItemsEntity>;
  findProductsByCartId(cartId: string): Promise<CartItemsEntity[]>;
  findProductInCart(
    cartId: string,
    productId: string,
  ): Promise<CartItemsEntity | null>;
  deleteProduct(id: string): Promise<boolean>;
  deleteProductsByCartId(cartId: string): Promise<boolean>;
}
