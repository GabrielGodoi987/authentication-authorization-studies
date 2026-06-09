import { v4 } from "uuid";

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
    this.id = id || v4();
    this.productId = productId;
    this.cartId = cartId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getProductId(): string {
    return this.productId;
  }

  setProductId(productId: string): void {
    this.productId = productId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  getPrice(): number {
    return this.value;
  }

  setPrice(value: number): void {
    this.value = this.quantity * value;
  }

  getUnitPrice(): number {
    return this.unitPrice;
  }

  getCartId(): string {
    return this.cartId;
  }

  setCartId(cartId: string): void {
    this.cartId = cartId;
  }

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.value = value;
  }

  public updateQuantity(newQuantity: number) {
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
}
