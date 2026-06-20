import { v4 } from "uuid";
import {
  CartItemCartIdCannotBeEmptyException,
  CartItemIdCannotBeEmptyException,
  CartItemPriceCannotBeNegativeException,
  CartItemProductIdCannotBeEmptyException,
  CartItemQuantityMustBePositiveException,
  InvalidCartItemPriceException,
  InvalidCartItemQuantityException,
} from "../domain-exceptions/cart.exceptions";

export class CartItemsEntity {
  private id: string;
  private productId: string;
  private cartId: string;
  private value: number;
  private quantity: number;
  private unitPrice: number;

  constructor(
    id: string | null,
    productId: string,
    quantity: number,
    unitPrice: number,
    cartId: string,
  ) {
    this.validateId(id);
    this.validateProductId(productId);
    this.validateCartId(cartId);
    this.validateQuantity(quantity);
    this.validatePrice(unitPrice);

    this.id = id || v4();
    this.productId = productId;
    this.cartId = cartId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.value = this.quantity * this.unitPrice;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.validateId(id);
    this.id = id;
  }

  getProductId(): string {
    return this.productId;
  }

  setProductId(productId: string): void {
    this.validateProductId(productId);
    this.productId = productId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  setQuantity(quantity: number): void {
    this.updateQuantity(quantity);
  }

  getPrice(): number {
    return this.value;
  }

  setPrice(value: number): void {
    this.validatePrice(value);
    this.unitPrice = value;
    this.value = this.quantity * value;
  }

  getUnitPrice(): number {
    return this.unitPrice;
  }

  getCartId(): string {
    return this.cartId;
  }

  setCartId(cartId: string): void {
    this.validateCartId(cartId);
    this.cartId = cartId;
  }

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.validatePrice(value);
    this.value = value;
  }

  public updateQuantity(newQuantity: number) {
    this.validateQuantity(newQuantity);
    this.quantity = newQuantity;
    this.value = this.quantity * this.unitPrice;
  }

  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      value: this.value,
    };
  }

  private validateId(id: string | null): void {
    if (id !== null && id.trim() === "") {
      throw new CartItemIdCannotBeEmptyException();
    }
  }

  private validateProductId(productId: string): void {
    if (!productId || productId.trim() === "") {
      throw new CartItemProductIdCannotBeEmptyException();
    }
  }

  private validateCartId(cartId: string): void {
    if (!cartId || cartId.trim() === "") {
      throw new CartItemCartIdCannotBeEmptyException();
    }
  }

  private validateQuantity(quantity: number): void {
    if (
      typeof quantity !== "number" ||
      Number.isNaN(quantity) ||
      !Number.isFinite(quantity) ||
      !Number.isInteger(quantity)
    ) {
      throw new InvalidCartItemQuantityException();
    }

    if (quantity <= 0) {
      throw new CartItemQuantityMustBePositiveException();
    }
  }

  private validatePrice(price: number): void {
    if (
      typeof price !== "number" ||
      Number.isNaN(price) ||
      !Number.isFinite(price)
    ) {
      throw new InvalidCartItemPriceException();
    }

    if (price < 0) {
      throw new CartItemPriceCannotBeNegativeException();
    }
  }
}
