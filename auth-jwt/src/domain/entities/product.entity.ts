import { v4 } from "uuid";

export class ProductEntity{
  private id: string;
  private name: string
  private price: number;
  
  constructor(id: string | null, name: string, price: number) {
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
    this.name = name;
  }

  getPrice(): number {
    return this.price;
  }

  setPrice(price: number): void {
    this.price = price;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
    };
  }
}