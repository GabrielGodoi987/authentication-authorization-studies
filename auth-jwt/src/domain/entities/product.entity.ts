import { v4 } from "uuid";
import {
  InvalidProductPriceException,
  ProductNameCannotBeEmptyException,
  ProductNameCannotBeNullException,
  ProductPriceCannotBeNegativeException,
} from "../domain-exceptions/product.exceptions";

export class ProductEntity {
  private id: string;
  private name: string;
  private price: number;

  constructor(id: string | null, name: string, price: number) {
    this.validateName(name);
    this.validatePrice(price);

    this.id = id || v4();
    this.name = name;
    this.price = price;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.validateName(name);
    this.name = name;
  }

  getPrice(): number {
    return this.price;
  }

  setPrice(price: number): void {
    this.validatePrice(price);
    this.price = price;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
    };
  }

  private validateName(name: string): void {
    if (name === null || name === undefined) {
      throw new ProductNameCannotBeNullException();
    }

    if (name.trim() === "") {
      throw new ProductNameCannotBeEmptyException();
    }
  }

  private validatePrice(price: number): void {
    if (typeof price !== "number" || Number.isNaN(price)) {
      throw new InvalidProductPriceException();
    }

    if (price < 0) {
      throw new ProductPriceCannotBeNegativeException();
    }
  }
}
