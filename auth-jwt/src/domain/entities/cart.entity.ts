import { CartItemsEntity } from "./cart-items.entity";
import {
  CartIdCannotBeEmptyException,
  CartProductCannotBeNullException,
  CartProductNotFoundException,
  CartUserIdCannotBeEmptyException,
} from "../domain-exceptions/cart.exceptions";
import { ProductEntity } from "./product.entity";

export class CartEntity {
  private id: string;
  private userId: string;
  private price: number;
  private cartItems: CartItemsEntity[];

  constructor(id: string, userId: string) {
    this.validateId(id);
    this.validateUserId(userId);

    this.id = id;
    this.userId = userId;
    this.price = 0;
    this.cartItems = [];
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getPrice(): number {
    return this.price;
  }

  getCartItems(): CartItemsEntity[] {
    return this.cartItems;
  }

  getTotalPrice(): number {
    let sum: number = 0;
    this.cartItems.forEach((cartItem) => {
      sum += cartItem.getPrice();
    });
    return sum;
  }

  addProduct(product: ProductEntity, quantity: number): void {
    this.validateProduct(product);

    const existing = this.cartItems.find(
      (p) => p.getProductId() === product.getId(),
    );
    if (existing) {
      existing.setQuantity(existing.getQuantity() + quantity);
    } else {
      const cartItem = new CartItemsEntity(
        null,
        product.getId(),
        quantity,
        product.getPrice(),
        this.getId(),
      );
      this.cartItems.push(cartItem);
    }
    this.recalculatePrice();
  }

  removeProduct(productId: string): void {
    this.validateProductId(productId);
    this.ensureProductExists(productId);

    this.cartItems = this.cartItems.filter(
      (p) => p.getProductId() !== productId,
    );
    this.recalculatePrice();
  }

  updateProductQuantity(productId: string, quantity: number): void {
    this.validateProductId(productId);

    const product = this.cartItems.find((p) => p.getProductId() === productId);
    if (!product) {
      throw new CartProductNotFoundException();
    }

    product.updateQuantity(quantity);
    this.recalculatePrice();
  }

  private recalculatePrice(): void {
    this.price = this.cartItems.reduce((total, cp) => total + cp.getPrice(), 0);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      price: this.price,
      products: this.cartItems.map((p) => p.toJSON()),
    };
  }

  private validateId(id: string): void {
    if (!id || id.trim() === "") {
      throw new CartIdCannotBeEmptyException();
    }
  }

  private validateUserId(userId: string): void {
    if (!userId || userId.trim() === "") {
      throw new CartUserIdCannotBeEmptyException();
    }
  }

  private validateProduct(product: ProductEntity): void {
    if (!product) {
      throw new CartProductCannotBeNullException();
    }
  }

  private validateProductId(productId: string): void {
    if (!productId || productId.trim() === "") {
      throw new CartProductNotFoundException();
    }
  }

  private ensureProductExists(productId: string): void {
    const exists = this.cartItems.some((p) => p.getProductId() === productId);
    if (!exists) {
      throw new CartProductNotFoundException();
    }
  }
}
