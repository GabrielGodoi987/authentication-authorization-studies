import { v4 } from "uuid";

export class CartItemsEntity {
  private id: string;
  private productId: string;
  private value: number;
  private quantity: number;

  constructor(id: string | null, productId: string, quantity: number) {
    this.id = id || v4();
    this.productId = productId;
    this.quantity = quantity;
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

  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      quantity: this.quantity,
      value: this.value,
    };
  }
}
