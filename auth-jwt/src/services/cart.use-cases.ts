import { v4 } from "uuid";
import { CartProductEntity } from "../domain/entities/cart-product.entity";
import { CartEntity } from "../domain/entities/cart.entity";
import { type CartRepository } from "../domain/repositorie/cart.repository";
import {
  FindCartByIdSpec,
  FindCartByUserIdSpec,
} from "../domain/specifications/cart.specifications";
import {
  CartAccessDeniedException,
  CartNotFoundException,
  CartProductNotFoundException,
} from "../http/exceptions/cart.exception";

export class CreateCartUseCase {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(userId: string): Promise<CartEntity> {
    const existing = await this.cartRepo.findOne(
      new FindCartByUserIdSpec(userId),
    );
    if (existing) {
      return existing;
    }

    const cart = new CartEntity(v4(), userId);
    return this.cartRepo.save(cart);
  }
}

export class FindCartByIdUseCase {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(cartId: string, userId: string): Promise<CartEntity> {
    const cart = await this.cartRepo.findOne(new FindCartByIdSpec(cartId));

    if (!cart) {
      throw new CartNotFoundException({ message: "Cart not found" });
    }

    if (cart.getUserId() !== userId) {
      throw new CartAccessDeniedException({
        message: "You do not have access to this cart",
      });
    }

    return cart;
  }
}

export class FindCartByUserIdUseCase {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(userId: string): Promise<CartEntity | null> {
    return this.cartRepo.findOne(new FindCartByUserIdSpec(userId));
  }
}

export class AddProductToCartUseCase {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(
    cartId: string,
    userId: string,
    data: {
      productId: string;
      productName: string;
      quantity: number;
      price: number;
    },
  ): Promise<CartEntity> {
    const cart = await this.cartRepo.findOne(new FindCartByIdSpec(cartId));

    if (!cart) {
      throw new CartNotFoundException({ message: "Cart not found" });
    }

    if (cart.getUserId() !== userId) {
      throw new CartAccessDeniedException({
        message: "You do not have access to this cart",
      });
    }

    const product = new CartProductEntity(
      null,
      cartId,
      data.productId,
      data.productName,
      data.quantity,
      data.price,
    );

    const existing = cart
      .getCartProducts()
      .find((p) => p.getProductId() === data.productId);

    if (existing) {
      const newQty = existing.getQuantity() + data.quantity;
      await this.cartRepo.saveProduct(
        new CartProductEntity(
          existing.getId(),
          cartId,
          data.productId,
          data.productName,
          newQty,
          data.price,
        ),
      );
    } else {
      await this.cartRepo.saveProduct(product);
    }

    const updated = await this.cartRepo.findOne(
      new FindCartByIdSpec(cartId),
    );
    return updated!;
  }
}

export class UpdateCartProductQuantityUseCase {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(
    cartId: string,
    productId: string,
    userId: string,
    quantity: number,
  ): Promise<CartEntity> {
    const cart = await this.cartRepo.findOne(new FindCartByIdSpec(cartId));

    if (!cart) {
      throw new CartNotFoundException({ message: "Cart not found" });
    }

    if (cart.getUserId() !== userId) {
      throw new CartAccessDeniedException({
        message: "You do not have access to this cart",
      });
    }

    const existing = await this.cartRepo.findProductInCart(cartId, productId);
    if (!existing) {
      throw new CartProductNotFoundException({
        message: "Product not found in cart",
      });
    }

    existing.setQuantity(quantity);
    await this.cartRepo.saveProduct(existing);

    const updated = await this.cartRepo.findOne(
      new FindCartByIdSpec(cartId),
    );
    return updated!;
  }
}

export class RemoveProductFromCartUseCase {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(
    cartId: string,
    productId: string,
    userId: string,
  ): Promise<CartEntity> {
    const cart = await this.cartRepo.findOne(new FindCartByIdSpec(cartId));

    if (!cart) {
      throw new CartNotFoundException({ message: "Cart not found" });
    }

    if (cart.getUserId() !== userId) {
      throw new CartAccessDeniedException({
        message: "You do not have access to this cart",
      });
    }

    const existing = await this.cartRepo.findProductInCart(cartId, productId);
    if (!existing) {
      throw new CartProductNotFoundException({
        message: "Product not found in cart",
      });
    }

    await this.cartRepo.deleteProduct(existing.getId());

    const updated = await this.cartRepo.findOne(
      new FindCartByIdSpec(cartId),
    );
    return updated!;
  }
}

export class DeleteCartUseCase {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(cartId: string, userId: string): Promise<boolean> {
    const cart = await this.cartRepo.findOne(new FindCartByIdSpec(cartId));

    if (!cart) {
      throw new CartNotFoundException({ message: "Cart not found" });
    }

    if (cart.getUserId() !== userId) {
      throw new CartAccessDeniedException({
        message: "You do not have access to this cart",
      });
    }

    return this.cartRepo.delete(cartId);
  }
}
