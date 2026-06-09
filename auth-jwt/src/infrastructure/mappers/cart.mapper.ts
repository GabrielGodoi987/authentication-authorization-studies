import { CartItemsEntity } from "../../domain/entities/cart-items.entity";
import { CartEntity } from "../../domain/entities/cart.entity";
import { CartItemsPersistenceEntity } from "../persistence/cart-items-persistence.entity";
import { CartPersistenceEntity } from "../persistence/cart-persistence.entity";

export class CartMapper {
  toDomain(persistence: CartPersistenceEntity): CartEntity {
    const cart = new CartEntity(persistence.id, persistence.userId);
    if (persistence.cartItems) {
      const products = persistence.cartItems.map((ci) =>
        this.cartProductToDomain(ci),
      );
      cart.getCartItems().push(...products);
    }
    return cart;
  }

  toPersistence(cart: CartEntity): Partial<CartPersistenceEntity> {
    return {
      id: cart.getId(),
      userId: cart.getUserId(),
      price: cart.getPrice(),
    };
  }

  cartProductToDomain(
    persistence: CartItemsPersistenceEntity,
  ): CartItemsEntity {
    return new CartItemsEntity(
      persistence.id,
      persistence.productId,
      persistence.quantity,
      persistence.value,
      persistence.cartId,
    );
  }

  cartProductToPersistence(
    domain: CartItemsEntity,
  ): Partial<CartItemsPersistenceEntity> {
    return {
      id: domain.getId(),
      cartId: domain.getCartId(),
      productId: domain.getProductId(),
      quantity: domain.getQuantity(),
      value: domain.getValue(),
    };
  }
}
