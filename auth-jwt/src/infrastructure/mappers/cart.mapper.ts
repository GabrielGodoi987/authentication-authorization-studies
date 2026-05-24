import { CartProductEntity } from "../../domain/entities/cart-product.entity";
import { CartEntity } from "../../domain/entities/cart.entity";
import { CartProductPersistenceEntity } from "../persistence/cart-product-persistence.entity";
import { CartPersistenceEntity } from "../persistence/cart-persistence.entity";

export class CartMapper {
  toDomain(persistence: CartPersistenceEntity): CartEntity {
    const cart = new CartEntity(persistence.id, persistence.userId);
    if (persistence.cartProducts) {
      const products = persistence.cartProducts.map((cp) =>
        this.cartProductToDomain(cp),
      );
      cart.setCartProducts(products);
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
    persistence: CartProductPersistenceEntity,
  ): CartProductEntity {
    return new CartProductEntity(
      persistence.id,
      persistence.cartId,
      persistence.productId,
      persistence.productName,
      persistence.quantity,
      persistence.price,
    );
  }

  cartProductToPersistence(
    domain: CartProductEntity,
  ): Partial<CartProductPersistenceEntity> {
    return {
      id: domain.getId(),
      cartId: domain.getCartId(),
      productId: domain.getProductId(),
      productName: domain.getProductName(),
      quantity: domain.getQuantity(),
      price: domain.getPrice(),
    };
  }
}
