import { CartProductEntity } from "./cart-product.entity";

export class CartEntity {
  private id: string;
  private userId: string;
  private price: number;
  private cartProducts: CartProductEntity[];

  constructor(id: string, userId: string) {
    this.id = id;
    this.userId = userId;
    this.price = 0;
    this.cartProducts = [];
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

  getCartProducts(): CartProductEntity[] {
    return this.cartProducts;
  }

  setCartProducts(products: CartProductEntity[]): void {
    this.cartProducts = products;
    this.recalculatePrice();
  }

  addProduct(product: CartProductEntity): void {
    const existing = this.cartProducts.find(
      (p) => p.getProductId() === product.getProductId(),
    );
    if (existing) {
      existing.setQuantity(existing.getQuantity() + product.getQuantity());
    } else {
      this.cartProducts.push(product);
    }
    this.recalculatePrice();
  }

  removeProduct(productId: string): void {
    this.cartProducts = this.cartProducts.filter(
      (p) => p.getProductId() !== productId,
    );
    this.recalculatePrice();
  }

  updateProductQuantity(productId: string, quantity: number): void {
    const product = this.cartProducts.find(
      (p) => p.getProductId() === productId,
    );
    if (product) {
      product.setQuantity(quantity);
      this.recalculatePrice();
    }
  }

  private recalculatePrice(): void {
    this.price = this.cartProducts.reduce(
      (total, cp) => total + cp.getTotalPrice(),
      0,
    );
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      price: this.price,
      products: this.cartProducts.map((p) => p.toJSON()),
    };
  }
}
