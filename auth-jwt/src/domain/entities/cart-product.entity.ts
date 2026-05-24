import { v4 } from "uuid";

export class CartProductEntity {
  private id: string;
  private cartId: string;
  private productId: string;
  private productName: string;
  private quantity: number;
  private price: number;

  constructor(
    id: string | null,
    cartId: string,
    productId: string,
    productName: string,
    quantity: number,
    price: number,
  ) {
    this.id = id || v4();
    this.cartId = cartId;
    this.productId = productId;
    this.productName = productName;
    this.quantity = quantity;
    this.price = price;
  }

  getId(): string {
    return this.id;
  }

  getCartId(): string {
    return this.cartId;
  }

  getProductId(): string {
    return this.productId;
  }

  getProductName(): string {
    return this.productName;
  }

  getQuantity(): number {
    return this.quantity;
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  getPrice(): number {
    return this.price;
  }

  getTotalPrice(): number {
    return this.price * this.quantity;
  }

  toJSON() {
    return {
      id: this.id,
      cartId: this.cartId,
      productId: this.productId,
      productName: this.productName,
      quantity: this.quantity,
      price: this.price,
      totalPrice: this.getTotalPrice(),
    };
  }
}
